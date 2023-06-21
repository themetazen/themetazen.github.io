const getEventType = (eventName) => {
    let eventType = eventName.replace(/^on/, '').toLowerCase();

    if (eventType === 'change') {
        eventType = 'input';
    }

    switch (eventType) {
        case 'change':
            return 'input';
        
        case 'doubleclick':
            return 'dblclick';
    
        case 'focus':
            return 'focusin';

        case 'blur':
            return 'focusout';
    
        default:
            return eventType;;
    }
}

const addEvent = (element, eventName, handler) => {
    const eventType = getEventType(eventName);
    element.addEventListener(eventType, handler);
}

const addChild = (element, child) => {
    if (Array.isArray(child)) {
        child.forEach((c) => addChild(element, c));
    } else if (child instanceof HTMLElement || typeof child === 'object') {
        element.appendChild(child)
    } else {
        element.appendChild(document.createTextNode(child));
    }
}

const createElement = (tag, attributes, ...children) => {
    if (typeof tag === 'function') {
        return tag({...attributes}, children);
    }

    let element = document.createElement(tag);

    for (let attr in attributes) {
        if (attr === 'style') {
            Object.keys(attributes.style).map(
                (key) => (element.style[key] = attributes.style[key])
            );
        } else if (attr === 'className') {
            element.setAttribute('class', attributes[attr]);
        } else if (attr.substring(0, 2) === 'on') {
            addEvent(element, attr, attributes[attr]);
        } else if ((tag === 'button' || 'input' || 'textarea' || 'select') && attr === 'disabled') {
            const value = attributes[attr];
            element.disabled = value;
        } else {
            element.setAttribute(attr, attributes[attr]);
        }
    }

    (children || []).forEach((c) => addChild(element, c));

    return element;
};

export { createElement };