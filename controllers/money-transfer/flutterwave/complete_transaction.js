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
    // Check if mobile money charge was successful
    if (response.data.status === "successful") {
        const {uuid, user_id, sender, mobile_number, 
            receiver_number, receive_amount, tx_ref,
            receiver_name, network, currency, contry_code, operator, 
            receiver_currency } = response.data.meta
        
        // Check if webhook call is for a transaction being delivered
        const transaction = await CrossPayTransactionService.getTransaction(uuid)
        const txStatus = transaction.data().status
        const deliveryStatus = transaction.data().delivered_status
        if(txStatus === TransactionStatus.COMPLETED 
            && deliveryStatus === TransactionStatus.INPROGRESS) {
            // Update transaction delivery status
            const status = TransactionStatus.COMPLETED
            await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
            await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)

            // Send transaction delivered notification
        }
        // Update mobile momey charge transaction status
        const status = TransactionStatus.COMPLETED
        await CrossPayTransactionService.updateTransactionStatus(uuid, status)
        await CrossPayTransactionService.updateUserTransactionStatus(uuid, user_id, status)

        // Fund virtual subaccount wallet account

        // Send Money to receiver phone number
        // Check if transaction has already been initiated/completed to prevent 
        // sending money to the same mobile money account again
        if (deliveryStatus !== TransactionStatus.INPROGRESS
          && deliveryStatus !== TransactionStatus.COMPLETED) {
            // Send money from main account balance
            const details = {
              account_bank: operator,
              account_number: `${contry_code}${receiver_number}`,
              amount: receive_amount,
              currency: receiver_currency,
              beneficiary_name: receiver_name,
              reference: tx_ref,
              meta: response.data.meta
          };
          const transfer = await FlutterwaveService.initiateTransfer(details)
          crossPayLogger.info('Flutterwave transfer', [transfer])
          if(transfer.data.status === 'NEW') {
              const status = TransactionStatus.INPROGRESS
              await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
              await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)
  
              // Send transaction in progress notification
              
              res.status(200).send(transfer.data).end()
          } {
            res.status(200).send(transfer.data).end()
          }

          // Send money from wallet balance
          /* const user = await CrossPayUserService.getUser(user_id)
          const details = {
              account_bank: operator,
              account_number: `${contry_code}${receiver_number}`,
              amount: receive_amount,
              currency: receiver_currency,
              beneficiary_name: receiver_name,
              debit_currency: currency,
              debit_subaccount: user.sub_account.account_reference,
              reference: tx_ref,
              meta: response.data.meta
          };
          const transfer = await FlutterwaveService.initiateTransfer(details)
          crossPayLogger.info('Flutterwave transfer', [transfer])
          if(transfer.data.status === 'NEW') {
              const status = TransactionStatus.INPROGRESS
              await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
              await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)
  
              // Send transaction in progress notification
          } */
        }
        res.end()
    } else {
        const {uuid, user_id, sender, mobile_number, receiver_number, receiver_name, network } = response.data.meta
        const status = TransactionStatus.FAILED
        await CrossPayTransactionService.updateTransactionStatus(uuid, status)
        await CrossPayTransactionService.updateUserTransactionStatus(uuid, user_id, status)
        await CrossPayTransactionService.updateDeliveredStatus(uuid, status)
        await CrossPayTransactionService.updateUserDeliveredStatus(uuid, user_id, status)
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
