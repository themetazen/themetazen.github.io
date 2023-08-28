import { CHAIN, THEME, TonConnect, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui';
import { getAccountInfo, screenAddress } from './utils';

export class WalletConnect {
    tonConnect: TonConnectUI;
    container: any;
    store: any;
    connector: TonConnect;

    constructor(container: any, store: any) {
        this.container = container;
        this.store = store;

        this.connector = new TonConnect();
        this.tonConnect = new TonConnectUI({
            manifestUrl: 'https://themetazen.xyz/tonconnect-manifest.json',
            connector: this.connector,
            buttonRootId: 'connector',
        });

        this.tonConnect.uiOptions = {
            uiPreferences: {
                theme: THEME.DARK,
                borderRadius: 's'
            },
            actionsConfiguration: {
                modals: [],
                notifications: []
            }
        }

        const unsubscribe = this.tonConnect.onStatusChange(walletInfo => {
            if (walletInfo) {
                this.store.setAddress(walletInfo.account.address);    
                this.renderAccountContainer();
            } else {
                this.container.replaceChildren();
                this.container.appendChild(this.connectButtonSidebar());
            }
        });
    }

    async renderAccountContainer() {
        if (!this.isLogged()) {
            return;
        }
    
        getAccountInfo(this.store.address).then((data) => {
            const {
                balance,
                name,
                status
            } = data;
            
            this.store.setBalance(balance);
            this.store.setName(name);
            this.store.setActiveStatus(status);
        
            this.container.replaceChildren();
            
            const ul = document.createElement('ul');
            ul.classList.add('account__nav');
        
            this.walletInfoItemsSidebar(ul);
            this.logoutItemSidebar(ul);
                
            this.container.appendChild(ul);
        });
    }

    walletInfoItemsSidebar(_node: HTMLUListElement) {
        const node = _node;

        const userFriendlyAddress = 
            toUserFriendlyAddress(this.store.address, this.tonConnect.account.chain === CHAIN.TESTNET);
        const screenUserFriendlyAddress = screenAddress(userFriendlyAddress);
    
        const balance = (this.store.balance * 1e-9).toFixed(2);
        const currencyBalance = (this.store.price * Number(balance)).toFixed(2);
    
        const itemWallet = document.createElement('li');
        itemWallet.classList.add('account__nav-item');
        itemWallet.innerHTML = `
            <div class="account__nav-content">
                <i class="icon wallet"></i>
                <a href="https://tonviewer.com/${userFriendlyAddress}" target="_blank">
                    <div class="name">${this.store.name ? this.store.name.slice(0, -4) : screenUserFriendlyAddress}</div>
                    ${this.store.name ? `<div class="sub">${screenUserFriendlyAddress}</div>` : ''}
                </a>
            </div>
        `;
        itemWallet.appendChild(this.copyButtonSidebar(userFriendlyAddress));
    
        const itemBalance = document.createElement('li');
        itemBalance.classList.add('account__nav-item');
        itemBalance.innerHTML = `
            <div class="account__nav-content">
                <i class="icon toncoin"></i>
               <div><div class="balance">${balance} TON</div>
                <div class="sub">~ ${this.store.currencyList[this.store.currency].symbol}${currencyBalance}</div></div>
            </div>
        `;
    
        node.appendChild(itemWallet);
        node.appendChild(itemBalance);
    }
    
    logoutItemSidebar(_node: HTMLUListElement) {
        const node = _node;

        const item = document.createElement('li');
        item.classList.add('account__nav-item');

        const a = document.createElement('a');
        a.innerHTML = `
            <div class="account__nav-content logout">
                <i class="icon logout"></i>Log Out
             </div>
        `;
        a.addEventListener('click', () => this.tonConnect.disconnect(), false);
        
        item.appendChild(a);
        node.appendChild(item);
    }
    
    copyButtonSidebar(address: string)  {
        const a = document.createElement('a');
        a.setAttribute('title', 'Copy address');
        a.innerHTML = '<i class="icon copy"></i>';
        a.addEventListener('click', () => {
            navigator.clipboard.writeText(address);
            a.innerHTML = '<i class="icon check"></i>';
            setTimeout(() => {
                a.innerHTML = '<i class="icon copy"></i>';
            }, 1000);
        }, false);
        return a;
    }

    connectButtonSidebar() {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.textContent = 'Connect Wallet';
        button.addEventListener('click', () => this.tonConnect.connectWallet(), false);
        return button;
    }

    isLogged() {
        return !!this.tonConnect.connected;
    }
}