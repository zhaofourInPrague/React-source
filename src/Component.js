import { findDOM, compareTwoVdom } from "./react-dom";

/**
 * 1. setState完全依赖于updater实例，将新的state更新并发起dom更新，而更新的逻辑依赖forceUpdate
 * 2. forceUpdate更新dom，在state更新后马上更新dom结点
*/
class Component {
    static isReactComponent = true;
    constructor(props) {
        this.props = props;
        this.state = {};
        this.updater = new Updater(this);
    }

    setState(partialState) {
        this.updater.addState(partialState)
    }

    forceUpdate() {
        const oldRenderVdom = this.oldRenderVdom;
        const oldDom = findDOM(oldRenderVdom);
        const newRenderVdom = this.render();
        // compareTwoVdom中其实直接将新dom替换了旧dom
        compareTwoVdom(oldDom.parentNode, oldRenderVdom, newRenderVdom);
        // 替换之后oldRenderVdom就更新为new
        this.oldRenderVdom = newRenderVdom;
    }
    
}

/**
 * 分析
 * 1. updater类 + shouldUpdate 的作用服务于Component
 *    Component只保持setState, forceUpdate方法
*/
class Updater{
    constructor(classInstance) {
        this.classInstance = classInstance;
        this.pendingStates = [];
    }

    addState(partialState) {
        this.pendingStates.push(partialState);
        this.emitUpdate();
    }

    emitUpdate() {
        this.updateComponent()
    }

    updateComponent() {
        const {classInstance, pendingStates} = this;
        if(pendingStates.length > 0) {
            shouldUpdate(classInstance, this.getState());
        }
    }

    getState() {
        const {classInstance, pendingStates} = this;
        let {state} = classInstance;
        pendingStates.forEach(pendingState => state = {...state, ...pendingState});
        pendingStates.length = 0;
        return state;
    }

}

/**
 * 1. 此方法接受俩个参数，实例与新state
 * 2. 内部就是更新实例的state和调用forceUpdate方法更新dom
*/
function shouldUpdate(classInstance, nextState) {
    classInstance.state = nextState;
    classInstance.forceUpdate();
}

export default Component;