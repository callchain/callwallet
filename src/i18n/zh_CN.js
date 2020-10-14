module.exports = {
    home: {
        term: '服务协议'
    },
    header: {
        logout: '退出',
        offline: '离线'
    },
    nodata: {
        welcome: '欢迎使用Callchain',
        nofund: "你的当前钱包不持有CALL Token。为了使用Callchain，你可以这样开始：",
        byuser: '邀请你的好友给你赠送1到多个CALL Token',
        byexchange: '从交易所或者网关购买CALL Token'
    },
    login:{
        open_wallet: '打开钱包',
        login_label: '输入钱包名称和密码打开你的钱包',
        wallet_name: '钱包名称',
        passphrase: '密码',
        new_to_call: '还没有Callchain账号? ',
        create_wallet: '创建钱包'
    },
    register: {
        create_wallet: '创建Callchain钱包',
        callchain_desc: "Callchain是数字资产价值网络，支持资产的低成本、便捷流通和交易，支持一键发币等基本功能。",
        wallet_hint: '你的钱包使用你的用户名和密码加密保存在浏览器. 请选择一个你方便记忆，但是不容易被他人猜到的密码。友情提示：可以包括字母、数字和字符。',
        wallet_warn1: '确保只有你有此钱包的名称和密码，且妥善保存，切勿泄露、分享给第三方。',
        wallet_warn2: 'CallWallet只将钱包保存在本浏览器，请勿清空本浏览器的缓存；如需清空，务必保存好钱包私钥。',
        wallet_warn3: '切记安全保存私钥，切记安全保存私钥，切记安全保存私钥，重要的事情说三篇！',
        wallet_warn4: 'Callchain无法为你恢复账号，请妥善保存私钥！',
        wallet_name: '钱包名称',
        wallet_passphrase: '钱包密码',
        wallet_confirm_passphrase: '确认密码',
        secret_key: '私钥 ',
        hide: '隐藏',
        do_create: '创建钱包',
        has_wallet: '已经有钱包？ ',
        do_open: '打开钱包',
        use_key: '恢复账号? ',
        do_use_key: '使用私钥恢复账号'
    },
    welcome: {
        title: '欢迎使用Callchain',
        important: '重要提示：',
        important_info: '私钥是你获取账号资产的唯一钥匙，如果你丢失了私钥，请立即转移资产到新的账号，且该账号不能再使用。',
        address: '地址：',
        secret: '私钥：',
        btn_text_part: '私钥',
        warn: '你已经安全保存私钥了吗？',
        yes: '我确认，我已经安全备份私钥',
        hide: '隐藏',
        show: '显示'
    },
    service: {
        title: '服务协议',
        back: '返回'
    },

    tabs: {
        wallet: '钱包',
        send: '发送',
        receive: '接收',
        issue: '发行',
        trade: '交易',
        advanced: '高级'
    },
    wallet: {
        index: {
            balance: '余额',
            history: '历史',
            security: '安全',
        },
        balance: {
            activity: '活动',
            history: '历史页面查看更多',
            date: '时间',
            event: '事件',
            reserve: '保留'
        },
        history: {
            loadmore: '加载更多',
            ok: '确定',
            date: '日期',
            desc: '描述'
        },
        security: {
            sec1: '你的钱包和资产是被密码算法安全的加密，只能被',
            sec2: '你自己的密码所解开',
            sec3: "不要和任何人分享你的密码，也别遗失密码！",
            sec4: "不要把密码告诉任何人！",
            key: '私钥',
            warn1: "这个私钥是用于紧急使用，通过钱包生成，你不需要脑力记忆它。",
            warn2: '私钥已经包好在你现在使用的钱包中。',
            warn3: '如果你丢失这个钱包或者清空了这个钱包，你可以通过私钥恢复钱包。',
            warn4: '请将私钥安全保存，不要让其他任何人知悉。',
            show: '显示我的密钥',
            doshow: '显示',
            dohide: '隐藏',
            safewarn: '请确定你在一个安全的环境中，没有人或者没有摄像头可以看到你的屏幕',
            no: '不',
            yes: '是的，显示'
        }
    },
    send: {
        send: {
            sendmoney: '发送资产',
            recipient: '接收者',
            willreceive: '接收者将收到',
            memo: '备注',
            send: '发送'
        },
        confirm: {
            sending: '你正在发送',
            to: '给',
            recipient: '接收者',
            receive: '他将收到',
            with: '备注是',
            sure: '你确定？',
            back: '返回',
            confirm: '确定'
        },
        submitted: {
            submitted: '你的交易已经提交到区块链。',
            hash: '交易标识：',
            balance: '你的余额会在交易清算后更新。',
            another: '发送另一个转账',
            back: '返回到余额页面'
        }
    },
    receive: {
        text: '这是你的钱包地址。可以分享这个地址给其他用户，这样他们可以用此地址给你转账。',
        tip: '提示：可以通过Ctrl+C (win)或者Command+C(OSX)进行复制地址。'
    },
    issue: {
        list: {
            issued: '已发行的资产',
            new: '发行新资产',
            noissue: '你还没发行过资产，现在就发行一个吧！',
            users: '用户'
        },
        new: {
            issue: '发行新资产',
            symbol: '标识',
            supply: '总量',
            desc: '描述',
            back: '返回',
            ok: '确定'
        },
        confirm: {
            text: '你正在发行新的资产',
            supply: '资产总量',
            desc: '资产描述',
            back: '返回',
            confirm: '发行',
            sure: '你确定？',
        },
        submitted: {
            submitted: '你的交易已经提交到区块链。',
            hash: '交易标识：',
            update: '你的发行列表将在交易清算后更新。',
            back: '返回发行列表'
        },
        touser: {
            text: '发行资产给用户',
            recipient: '接收者',
            willreceive: '用户将收到',
            back: '返回',
            confirm: '确定'
        },
        touserok: {
            submitted: '你的交易已经提交到区块链。',
            hash: '交易标识：',
            update: '你的发行信息将在交易清算后更新。',
            back: '返回发行列表'
        }
    },
    trade: {
        trade: '交易',
        pair: '交易对',
        price: '价格',
        size: '数量',
        buy: '买入',
        sell: '卖出',
        amount: '数量',
        avail: '可用',
        value: '总额',
        percent: '百分比',
        tobuy: '你正在创建一个买单',
        sure: '你确定？',
        back: '返回',
        confirm: '确定',
        active: '你的订单已经提交到区块链。',
        another: '再下一个单',
        tosell: '你正在创建一个卖单',
        pending: '订单列表',
        cancel: '取消',
        type: '类型',
        action: '操作',
        for: '交换'
    },
    advanced: {
        index: {
            trust: '信任',
            options: '选项'
        },
        trust: {
            add: '添加信任',
            currency: '资产',
            counterparty: '对家',
            limit: '限额',
            balance: '余额',
            actions: '操作',
            issuer: '发行方地址',
            token: '资产',
            back: '返回',
            trust: '信任',
            sure: '你确认要删除这个信任吗？',
            no: '取消',
            yes: '确认'
        },
        options: {
            options: '选项',
            node: 'Callchain节点服务',
            server: 'WebSocket主机名、端口和SSL配置',
            ssl: '使用安全的Websocket',
            save: '保存'
        }
    }
}
