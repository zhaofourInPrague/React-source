import { REACT_TEXT } from "./constants";

/**
 * 把虚拟DOM变成真实DOM插入到容器内部
 * @param {*} vdom 虚拟DOM
 * @param {*} container 容器 
 */
function render(vdom, container) {
    mount(vdom, container);
}
function mount(vdom, parentDOM) {
    let newDOM = createDOM(vdom)
    if (newDOM) {
        parentDOM.appendChild(newDOM)
    }
}
/**
 * 把虚拟DOM转成真实DOM
 */
function createDOM(vdom) {
    if (!vdom) return null;
    let { type, props } = vdom;
    let dom;//真实DOM
    if (type === REACT_TEXT) {//如果这个元素是一个文本的话
        dom = document.createTextNode(props.content);
    } else if (typeof type === 'function') {//如果类型是一个函数的话
        if (type.isReactComponent) {//说明它是一个类组件
            return mountClassComponent(vdom);
        } else {
            return mountFunctionComponent(vdom);
        }
    } else {
        dom = document.createElement(type);// div span p
    }
    //处理属性
    if (props) {
        updateProps(dom, {}, props);
        if (props.children) {
            let children = props.children;
            if (typeof children === 'object' && children.type) {//说明这是一个React元素
                mount(children, dom);
            } else if (Array.isArray(children)) {
                reconcileChildren(props.children, dom);
            }
        }
    }
    return dom;
}
function mountClassComponent(vdom) {
    let { type: ClassComponent, props } = vdom;
    let classInstance = new ClassComponent(props);
    let renderVdom = classInstance.render();
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}
function mountFunctionComponent(vdom) {
    let { type, props } = vdom;
    let renderVdom = type(props);
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom);
}
function reconcileChildren(childrenVdom, parentDOM) {
    childrenVdom.forEach(childVdom => mount(childVdom, parentDOM));
}
/**
 * 把新的属性更新到真实DOM上
 * @param {*} dom 真实DOM
 * @param {*} oldProps 旧的属性对象
 * @param {*} newProps 新的属性对象
 */
function updateProps(dom, oldProps, newProps) {
    for (let key in newProps) {
        if (key === 'children') {//children
            continue;//此处忽略子节点的处理
        } else if (key === 'style') {//style
            let styleObj = newProps[key];
            for (let attr in styleObj) {
                dom.style[attr] = styleObj[attr];
            }
        } else {
            dom[key] = newProps[key];//className
        }
    }
}
const ReactDOM = {
    render
}
export default ReactDOM;