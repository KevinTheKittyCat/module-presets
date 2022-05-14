Hooks.once('ready', () => {
    checkIfSettingsExists()
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
    console.log("hello")
}


function openModulePresets() {

    let context = game.settings.get("modulePresets", "presets");
    console.log(context)
    let test = new MyFormApplication(context, {
        popOut: true,
        template: "modules/module-presets/test.hbs",
        title: "test"
    })

    test.render(true)
}

function checkIfSettingsExists() {
    const setting = game.settings.storage.get("world").find(w => w.key === "modulePresets.presets")
    if (setting === undefined) {
        // TODO make setting if no setting
        game.settings.register("modulePresets", "presets", {
            scope: "world",
            config: false,
            type: Array,
            value: [{"module":{ title: "No Modules", content: {} }}]
        });

        game.settings.set("modulePresets", "presets", [{ title: "No Modules", content: {} }])
        console.log("undefined")
    }
    console.log("checked")
}

export class MyFormApplication extends FormApplication {
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
