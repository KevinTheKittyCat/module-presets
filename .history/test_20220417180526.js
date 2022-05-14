Hooks.once('ready', () => {
    addModulePresetButton()
})

function addModulePresetButton() {
    const originalModuleButton = $('*[data-action="modules"]')[0]

    const element = originalModuleButton;
    element.style.cssText += 'flex-grow:3;'

    const parent = element.parentNode;


    //Wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add("module-wrapper");
    parent.replaceChild(wrapper, element);

    // Add Original button back
    wrapper.appendChild(element);

    // Add new preset Button
    const presetButton = document.createElement('button');
    presetButton.textContent = "Presets"
    presetButton.style.cssText += "flex-shrink:2;"
    presetButton.addEventListener("click", openModulePresets)

    wrapper.appendChild(presetButton)
    var testing = "hello"
    console.log("hello")
}


function openModulePresets() {
    console.log("got Here")

    var test = new Application({
        popOut: true,
        template: "modules/fxmaster/templates/special-create.hbs"
    })


}

class myFormApplication extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }

    static get defaultOptions() {
        return super.defaultOptions;
    }

    getData(options = {}) {
        return super.getData().object; // the object from the constructor is where we are storing the data
    }

    activateListeners(html) {
        super.activateListeners(html);
    }

    async _updateObject(event, formData) {
        return;
    }
}
//var testing = "hello"