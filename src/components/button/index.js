import { createElement } from '../../utils/createElement';
import './index.scss';

export const ButtonComponent = ({text, onClick, disabled}) => {

    return createElement('button', {
        disabled: disabled,
        className: 'btn',
        onClick: onClick,
    }, text);
};