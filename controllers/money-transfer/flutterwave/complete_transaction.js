const CrossPayTransactionService = require('../../../services/transaction/crosspay_transaction_service')
const CrossPayNotificationService = require('../../../services/notification/crosspay_notification_service')
const FlutterwaveService = require('../../../services/payments/flutterwave/flutterwave_service')
const CrossPayUserService = require('../../../services/user/crosspay_user_service')
const { crossPayLogger, crossPayResponse } = require('../../../utils/utils')
const TransactionStatus = require('../../../models/transaction_status')

const completeTransaction = async (req, res) => {

  try {
    const transactionId = `${req.body.data.id}`
    const expectedAmount = req.body.data.amount
    const response = await FlutterwaveService.verify(transactionId)

    res.status(200).send(response.data)

    // Check if mobile money charge OR transfer was successful
    if (response.data.status === "successful" || response.data.status === "SUCCESSFUL") {

        const {uuid, user_id, sender, mobile_number, 
            receiver_number, receive_amount, tx_ref,
            receiver_name, network, currency, country_code, operator, 
            receiver_currency } = response.data.meta

        // Get transaction details 
        const transaction = await CrossPayTransactionService.getTransaction(uuid)
        const { tx_id, tx_status, tx_delivered_status } = transaction.data()
        
        // Check if webhook call is for a transfer being delivered
        if (response.data.id !== tx_id) {
          if(tx_status === TransactionStatus.COMPLETED 
            && tx_delivered_status === TransactionStatus.INPROGRESS) {
            // Update transaction delivery status
            const status = TransactionStatus.COMPLETED
            await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
            await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)

            // Update transfer status
            await CrossPayTransactionService.updateTransferStatus(uuid, status)

            // Send transaction delivered notification

            res.end()
          }
        }
        
        // Update mobile momey charge transaction status
        const status = TransactionStatus.COMPLETED
        await CrossPayTransactionService.updateTransactionStatus(uuid, status)
        await CrossPayTransactionService.updateUserTransactionStatus(uuid, user_id, status)

        // Fund virtual subaccount wallet

        // Send Money to receiver phone number
        // Check if transaction has already been initiated/completed to prevent 
        // sending money to the same mobile money account again
        if (tx_delivered_status !== TransactionStatus.INPROGRESS
          && tx_delivered_status !== TransactionStatus.COMPLETED) {
            // Send money from main account balance
            const details = {
              account_bank: operator,
              account_number: `${country_code}${receiver_number}`,
              amount: receive_amount,
              currency: receiver_currency,
              beneficiary_name: receiver_name,
              reference: tx_ref,
              meta: response.data.meta
          };
          const transfer = await FlutterwaveService.initiateTransfer(details)
          crossPayLogger.info('Flutterwave transfer', [transfer])
          if(transfer.data.status === 'NEW') {
              
              // Save transfer details
              await CrossPayTransactionService.saveTransfer(uuid, transfer.data);

              const status = TransactionStatus.INPROGRESS
              await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
              await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)
  
              // Send transaction in progress notification
              
              res.status(200).send(transfer.data).end()
          } {
            res.status(200).send(transfer.data).end()
          }

          // Send money from wallet balance

        }
        res.end()
    } else {
        const {uuid, user_id, sender, mobile_number, receiver_number, receiver_name, network } = response.data.meta

        // Get transaction details 
        const transaction = await CrossPayTransactionService.getTransaction(uuid)
        const { tx_id } = transaction.data()

        const status = TransactionStatus.FAILED
        await CrossPayTransactionService.updateTransactionStatus(uuid, status)
        await CrossPayTransactionService.updateUserTransactionStatus(uuid, user_id, status)
        await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
        await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)

        // Update transfer status
        if (response.data.id !== tx_id) {
          await CrossPayTransactionService.updateTransferStatus(uuid, status)
        }

        // Send failed notification to sender

        res.end()
    }

    res.status(200).end()

  } catch (error) {
    crossPayLogger.error('Flutterwave complete transaction error', [error])
    // return res.status(500).send('Sever error. Please contact admin')
  }
}

module.exports = completeTransaction
