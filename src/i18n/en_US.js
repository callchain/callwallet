module.exports = {
    home: {
        term: 'Term of Service'
    },
    header: {
        logout: 'logout',
        offline: 'Offline'
    },
    nodata: {
        welcome: 'Welcome to Callchain',
        nofund: "You currently don't have any Call Token (CALL). To get started you should have another user send you at least 1 CALL token.",
        byuser: 'Have another user send you 1 or more CALL',
        byexchange: 'Buy CALL at exchange or from gateway'
    },
    login:{
        open_wallet: 'Open Wallet',
        login_label: 'Enter the name and passphrase used to encrypt your wallet below.',
        wallet_name: 'Wallet Name',
        passphrase: 'Passphrase',
        new_to_call: 'New to Callchain? ',
        create_wallet: 'Create Wallet'
    },
    register: {
        create_wallet: 'Create a Callchain Wallet',
        callchain_desc: "Callchain is global open blockchain system for everyone's token issue. One click, easy and fast asset blockchain system.",
        wallet_hint: 'Your Wallet is only as safe as your Wallet username and passphrase, used to encrypt your Wallet data. Choose a passphrase you can easily remember but others cannot guess. Hint: Mix letters, numbers, and symbols.',
        wallet_warn1: 'Only you have this Wallet username and passphrase and are responsible for their safekeeping.',
        wallet_warn2: 'CallWallet ONLY SAVE YOUR ENCRYPTED ACCOUNT INFORMATION IN THIS BROWSER LOCALLY, WHEN CHANGE BROWSER YOU CAN NOT LOGIN!',
        wallet_warn3: 'KEEP YOUR SECRET KEY SAFE!',
        wallet_warn4: 'Callchain cannot recover them if you forget them!',
        wallet_name: 'Create Wallet username',
        wallet_passphrase: 'Create Wallet passphrase',
        wallet_confirm_passphrase: 'Re-enter passphrase',
        secret_key: 'Secret Account Key ',
        hide: 'Hide',
        do_create: 'Create Wallet',
        has_wallet: 'Already have a Wallet? ',
        do_open: 'Open Wallet',
        use_key: 'Need to use your Secret Key? ',
        do_use_key: 'Use Key'
    },
    welcome: {
        title: 'Welcome to Callchain',
        important: 'Important:',
        important_info: 'The Secret Account Key below gives access to your money in the unlikely case that you lose your wallet name or passphrase. In that case your contacts will be lost, but with this Secret Account Key alone anyone can retrieve your money. So please store it somewhere PRIVATE AND SAFE.',
        address: 'Callchain Address: ',
        secret: 'Secret Account key: ',
        btn_text_part: ' secret account key',
        warn: 'Have you saved your Secret Account Key somewhere safe?',
        yes: 'Yes, I saved my secret account key',
        hide: 'Hide',
        show: 'Show'
    },
    service: {
        title: 'Term of Service',
        back: 'Back'
    },

    tabs: {
        wallet: 'Wallet',
        send: 'Send',
        receive: 'Receive',
        issue: 'Issue',
        trade: 'Trade',
        advanced: 'Advanced'
    },
    wallet: {
        index: {
            balance: 'Balance',
            history: 'History',
            security: 'Security',
        },
        balance: {
            activity: 'Activity',
            history: 'Go History For More Transactions',
            date: 'Date',
            event: 'Event',
            reserve: 'reserve'
        },
        history: {
            loadmore: 'Load More',
            ok: 'OK',
            date: 'Date',
            desc: 'Description'
        },
        security: {
            sec1: 'Your money and wallet are protected digitally through encryption algorithms that can be unlocked',
            sec2: 'only with your personal keys',
            sec3: "No one else has them, so don't lose them!",
            sec4: "Never share them!",
            key: 'Secret Key',
            warn1: "This key is for emergency use only. You did not choose it. The network created it. You don't have to memorize it.",
            warn2: 'The Secret Key accesses Your money, which is already contained inside your wallet.',
            warn3: 'But if you ever lose your wallet, you can recover just your money with this key.',
            warn4: 'Store it somewhere safe, never share it.',
            show: 'Show my key',
            doshow: 'Show',
            dohide: 'Hide',
            safewarn: 'Are you in a safe place, where no person, or camera can see your screen?',
            no: 'No',
            yes: 'Yes,Show Me'
        }
    },
    send: {
        send: {
            sendmoney: 'Send Money',
            recipient: 'Recipient',
            willreceive: 'Recipient will receive',
            memo: 'Memo',
            send: 'Send'
        },
        confirm: {
            sending: 'You are sending',
            to: 'to',
            recipient: 'Recipient',
            receive: 'They will receive',
            with: 'With Memo',
            sure: 'Are you sure?',
            back: 'Back',
            confirm: 'Confirm'
        },
        submitted: {
            submitted: 'Your transaction has been submitted.',
            hash: 'Transaction Hash:',
            balance: 'Your account balance wil update once the payment has cleared.',
            another: 'Send another payment',
            back: 'Back to balance'
        }
    },
    receive: {
        text: 'This is your public address. Give this address to other users so they can send you money.',
        tip: 'Tip: Select and copy using Ctrl+C (Win), Command+C (OSX).'
    },
    issue: {
        list: {
            issued: 'Issued Token',
            new: 'New Issue',
            noissue: 'Not issue one token yet, issue one now!',
            users: 'Users'
        },
        new: {
            issue: 'Issue New Token',
            symbol: 'Symbol',
            supply: 'Total Supply',
            desc: 'Description',
            back: 'Back',
            ok: 'Issue'
        },
        confirm: {
            text: 'You are issuing new token',
            supply: 'Issue Supply',
            desc: 'Issue Description',
            back: 'Back',
            confirm: 'Confirm',
            sure: 'Are you sure?'
        },
        submitted: {
            submitted: 'Your transaction has been submitted.',
            hash: 'Transaction Hash:',
            update: 'Your issue list wil update once the issueset has cleared.',
            back: 'Back to Issue List'
        },
        touser: {
            text: 'Issue Token to User',
            recipient: 'Recipient',
            willreceive: 'Recipient will receive',
            back: 'Back',
            confirm: 'Confirm'
        },
        touserok: {
            submitted: 'Your transaction has been submitted.',
            hash: 'Transaction Hash:',
            update: 'Your issue information wil update once the payment has cleared.',
            back: 'Back to Issue List'
        }
    },
    trade: {
        trade: 'Trade',
        pair: 'Trade Pair',
        price: 'Price',
        size: 'Size',
        buy: 'BUY',
        sell: 'SELL',
        amount: 'Amount',
        avail: 'available',
        value: 'Total Value',
        percent: 'Percent',
        tobuy: 'You are about to create an order to buy',
        sure: 'Are you sure?',
        back: 'Back',
        confirm: 'Confirm',
        active: 'Your order is now active!',
        another: 'Submit another order',
        tosell: 'You are about to create an order to sell',
        pending: 'Pending Orders',
        cancel: 'Cancel',
        type: 'Type',
        action: 'Action',
        for: 'for'
    },
    advanced: {
        index: {
            trust: 'Trust',
            options: 'Options'
        },
        trust: {
            add: 'Add Trust',
            currency: 'Currency',
            counterparty: 'Counterparty',
            limit: 'Limit',
            balance: 'Balance',
            actions: 'Actions',
            issuer: 'Issuer of Callchain address',
            token: 'Token',
            back: 'Back',
            trust: 'Trust',
            sure: 'Are you want to delete this trustline?',
            no: 'No',
            yes: 'Yes, delete'
        },
        options: {
            options: 'Options',
            node: 'Callchain Service',
            server: 'WebSocket hostname, port, secure',
            ssl: 'Use secure WebSocket',
            save: 'Save'
        }
    }
}
