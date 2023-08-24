import { CHAIN, THEME, TonConnect, TonConnectUI, toUserFriendlyAddress } from '@tonconnect/ui';
import { TONAPI_ENDPOINT } from './constants';

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
            uiPreferences: {
                theme: THEME.DARK,
                borderRadius: 'none'
            }
        });

        this.tonConnect.onStatusChange(wallet => {
            if (wallet) {
                this.store.setAddress(wallet.account.address);    
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
    
        try {
            const response = await fetch(`${TONAPI_ENDPOINT}/accounts/${this.store.address}`);
    
            if (!response.ok) {
                throw new Error(await response.text());
            }
    
            const data = await response.json();
    
            const {
                balance,
                name,
                status
            } = data;
    
            this.store.setBalance(balance);
            this.store.setName(name);
            this.store.setActiveStatus(status);
            
        } catch (err) {
            throw err;
        }
    
        this.container.replaceChildren();
    
        const ul = document.createElement('ul');
        ul.classList.add('account__nav');
            
        const userFriendlyAddress = 
            toUserFriendlyAddress(this.store.address, this.tonConnect.account.chain === CHAIN.TESTNET);
        const screenUserFriendlyAddress = 
                userFriendlyAddress.slice(0, 6) + "\u2026" + userFriendlyAddress.slice(-4);
    
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
    
        const itemLogout = document.createElement('li');
        itemLogout.classList.add('account__nav-item');
        itemLogout.appendChild(this.logoutButtonSidebar());
    
        ul.appendChild(itemWallet);
        ul.appendChild(itemBalance);
        ul.appendChild(itemLogout);
    
        this.container.appendChild(ul);
    }

    connectButtonSidebar() {
        const button = document.createElement('button');
        button.classList.add('btn');
        button.textContent = 'Connect Wallet';
        button.addEventListener('click', () => this.tonConnect.connectWallet(), false);
        return button;
    }
    
    logoutButtonSidebar() {
        const a = document.createElement('a');
        a.innerHTML = `
            <div class="account__nav-content logout">
                <i class="icon logout"></i>Log Out
             </div>
        `;
        a.addEventListener('click', () => this.tonConnect.disconnect(), false);
        return a;
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

    isLogged() {
        return !!this.tonConnect.connected;
    }
}