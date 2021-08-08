/**
 * [react-dom.js]
 * 1. createDom(vdom)
 *    1. 改为export,外部需要引用
 *    2. return dom 之前添加 vdom.dom = dom;
 * 
 * 2. mountClassComponent(vdom)
 *    1. vdom.oldRenderVdom赋值添加一个连等 classInstance.oldRenderVdom = ...
 * 
 * 3. updateProps方法中
 *    1. 添加一个else if key以'on'为起始的, 内容
 *       dom[key小写化] 赋值 newProps[key]
 * 
 * 4. 添加 function findDOM(vdom)
 *    1. export 出去
 *    2. 判断 !vdom 返回 null
 *    3. 判断vdom.dom, 如果有 返回vdom.dom
 *       否则返回findDOM(vdom.oldRenderVdom)
 * 
 * 5. 添加 function compareTwoVdom(parentDOM, oldVdom, newVdom)
 *    1. export
 *    2. 声明oldDom 赋值 findDOM(oldVdom)
 *    3. 声明newDOM 赋值 createDOM(newVdom)
 *    4. parentDOM replaceChild 用新的更新旧的
 * 
 * [react.js]
 * 1. 引入 Component from './Component', 删除文件内的Component Class
 * 
 * [Component.js] 新增
 * 1. 声明 class Component {} 内容:
 *    1. 声明静态变量 isReactComponent = true;
 *    2. 构造函数(props){} this.props, this.state: {}, this.updater赋值 new Updater(this)
 *    3. setState(partialState)
 *       1. 暂时一句 this.updater.addState(partialState)
 *    4. forceUpdate()
 *       1. 声明oldRenderVodm 赋值 this.oldRenderVdom 找上次的虚拟dom
 *       2. 声明oldVdom 赋值findDOM(oldRenderVodm) 找上次的真实DOM -- 给oldDOM.parentNode用，找出原始的父结点
 *       3. 声明newRenderVdom = this.render()
 *       4. 调用compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom)
 *       5. this.oldRenderVdom 赋值 newRenderVdom
 *    5. export default Component
 * 
 * 2. 声明 class Updater{}
 *    1. 构造函数(classInstance)
 *       1. this.classInstance 赋值 classInstance
 *       2. this.pendingStates赋值 []
 *    2. addState(partialState)
 *       1. this.pendingStates push partialState
 *       2. 触发更新 通过 调用 this.emitUpdate()
 *    3. emitUpdate()
 *       1. this.updateComponent() 调用
 *    4. updateComponent()
 *       1. 声明 classInstance, pendingStates 从this中取值
 *       2. 判断pendingStates长度大于0 则 调用shouldUpdate(classInstance, this.getState())
 *    5. getState()
 *       1. 同样从 this 中取出 classInstance和 pendingStates
 *       2. 从 classInstance中取出 state // 老状态
 *       3. pendingStates forEach(partialStaet => ) 回调内容是 state = {...state, ...partialStaet}
 *       4. pendingStates长度置为0
 *       5. 返回 state
 * 
 * 3. 函数 shouldUpdate(classInstance, nextState)
 *    1. classInstance.state 赋值 nextState
 *    2. classInstance.forceUpdate() 强制更新
*/
