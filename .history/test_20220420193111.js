Hooks.once("init", function () {
    // Register custom system settings
    game.settings.register("modulePresets", "presets", {
        scope: "world",
        config: false,
        type: Object,
        name: "modulePresets"
        //value: [{ title: "No Modules", content: {} }]
    });
})

Hooks.once('ready', () => {
    checkIfSettingsExists()
    addModulePresetButton()

    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });
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
}



function openModulePresets() {
    let context = game.settings.get("modulePresets", "presets");
    let modulePresetManager = new StorageFormApplication(context, {
        popOut: true,
        width: "400px",
        template: "modules/module-presets/test.hbs",
        title: "test",
        classes: ["preset-browser"]
    })

    modulePresetManager.render(true)
}

function checkIfSettingsExists() {
    const setting = game.settings.get("modulePresets", "presets")
    if (Object.keys(setting).length === 0) {
        const modules = game.settings.get("core", "moduleConfiguration")
        const noModules = Object.keys(modules).forEach(m => {m = false})
        console.log(noModules)
        const stringified = "No Modules"// JSON.stringify(content)
        //game.settings.set("modulePresets", "presets", { presets: [{ title: "No Modules", content: noModules, stringified }] })
    }
}

export class StorageFormApplication extends FormApplication {
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


window.makePreset = async () => {
    const modules = game.settings.get("core", "moduleConfiguration")
    const presetsObj = game.settings.get("modulePresets", "presets")

    let result = ""
    const keys = Object.keys(modules);
    keys.forEach(function (key) {
        result += `${key}:${modules[key]} `
    })
    const stringified = result

    let name = await new Promise((resolve, reject) => {
        let form = new StorageFormApplication("", {
            popOut: true,
            width: "400px",
            template: "modules/module-presets/form.hbs",
            title: "form",
            //classes: [""]
        })


        new Promise((resolve) => {
            form.render(true)
            resolve("aight")
        })

        $(document.body).on("submit", "#myForm", function () {

            console.log("HERE IN OPTIONS")
            const namesing = $("#textInput").val()
            console.log()
            resolve(namesing)
        });
    })

    const newPreset = [{ title: name, content: { modules }, stringified }]
    console.log(newPreset)
    const combinedPresets = presetsObj.presets.concat(newPreset)

    const newPresetsObj = { presets: combinedPresets }

    game.settings.set("modulePresets", "presets", await newPresetsObj)
}

window.selectPreset = (content) => {
    console.log("content")
    console.log(content)
    const modules = game.settings.get("core", "moduleConfiguration")
    const returnedTarget = Object.assign(modules, content);
    game.settings.set("core", "moduleConfiguration", returnedTarget)
}