import { createElement } from '../../utils/createElement';
import './index.scss';

interface IButtonComponent {
    text: string;
    disabled: boolean;
    onClick: () => void;
}

export const ButtonComponent = ({text, onClick, disabled}: IButtonComponent) => {

    return createElement('button', {
        disabled: disabled,
        className: 'btn',
        onClick: onClick,
    }, text);
};