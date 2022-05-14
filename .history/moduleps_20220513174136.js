Hooks.once("init", function () {
    // Register custom Modules settings
    game.settings.register("modulePresets", "presets", {
        scope: "world",
        config: false,
        type: Object,
        name: "modulePresets"
    });
})

Hooks.once('ready', () => {
    checkIfSettingsExists()
    addModulePresetButton()


    // Add Handlebars helper to translate the Json for each preset description.
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });

    Handlebars.registerHelper('noModules', function (value) {
        if (value === "No Modules") return false
        return true;
    });
})

//Add the Preset button beside Foundry's "Manage Modules" Button.
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
        template: "modules/module-presets/PresetList.hbs",
        title: "Preset List",
        classes: ["preset-browser"]
    })
    modulePresetManager.render(true)
}

function checkIfSettingsExists() {
    const setting = game.settings.get("modulePresets", "presets")
    if (Object.keys(setting).length === 0) {
        const modules = game.settings.get("core", "moduleConfiguration")
        Object.keys(modules).forEach((m) => { modules[m] = false })
        const stringified = "No Modules"// JSON.stringify(content)
        game.settings.set("modulePresets", "presets", { presets: [{ title: "No Modules", id: "No Modules", content: modules, stringified }] })
    }
}

export class StorageFormApplication extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }

    static get defaultOptions() {
        return super.defaultOptions;
    }

    deleteEntry(id) {
        const presetsObj = game.settings.get("modulePresets", "presets")
        const presetObjDelete = presetsObj.presets.filter(obj => obj.id !== id)
        game.settings.set("modulePresets", "presets", { presets: presetObjDelete })
    }

    getData(options = {}) {
        return super.getData().object; // the object from the constructor is where we are storing the data
    }

    //Add Event Listener to bin to delete Preset
    activateListeners(html) {
        super.activateListeners(html);
        console.log(html[0])
        let test = html[0].querySelectorAll('.list-item')//.getElementById('deletePreset')


        console.log(test)

        test.forEach((t,i) => {

            console.log(t, t.id)
            t.addEventListener("click", event => {
                this.deleteEntry(t.id)
                $(t).remove()
            })
        })
        //document.getElementsByClassName("example")

        console.log(test())
        for (const element of html[0].children) {
            if (element?.classList[0] === "list-item") {
                for (const children of element.children) {
                    for (const child of children.children) {
                        if (child.classList[0] === "deletePreset") {
                            child.addEventListener("click", event => {
                                this.deleteEntry(element.id)
                                $(element).remove()
                            })
                        }
                    }
                }
            }
        }
    }

    async _updateObject(event, formData) {
        return;
    }
}

export class titleFormApplication extends FormApplication {
    constructor(object, options) {
        super(object, options);
    }

    static get defaultOptions() {
        return super.defaultOptions;
    }

    getData(options = {}) {
        return super.getData().object; // the object from the constructor is where we are storing the data
    }

    //Add Eventlistener to add a title for preset.
    activateListeners(html) {
        super.activateListeners(html);
        for (const element of html) {
            if (element.id === "myForm") {
                element.addEventListener("submit", event => {
                    for (const formElement of element) {
                        if (formElement.id === "textInput") {
                            const modules = game.settings.get("core", "moduleConfiguration")
                            const presetsObj = game.settings.get("modulePresets", "presets")

                            let result = ""
                            const keys = Object.keys(modules);
                            keys.forEach(function (key) {
                                result += `${key}:${modules[key]} `
                            })
                            const stringified = result
                            const customId = randomID()
                            //html.form

                            const newPreset = { title: formElement.value, content:modules, stringified, id: customId }
                            const combinedPresets = presetsObj.presets.concat(newPreset)

                            const newPresetsObj = { presets: combinedPresets }

                            game.settings.set("modulePresets", "presets", newPresetsObj)

                        }
                    }
                })
            }
        }
    }

    async _updateObject(event, formData) {
        return;
    }
}


window.makePreset = async () => {
    let name = await new Promise((resolve, reject) => {
        let form = new titleFormApplication("", {
            popOut: true,
            width: "400px",
            template: "modules/module-presets/form.hbs",
            title: "Preset Name Form",
            //classes: [""]
        })


        new Promise((resolve) => {
            form.render(true)
            resolve("aight")
        })
    })

}

window.selectPreset = (content) => {
    const modules = game.settings.get("core", "moduleConfiguration")
    const returnedTarget = Object.assign(modules, content);
    if (modules == returnedTarget) ui.notifications.warn("That Preset is currently in use.")
    game.settings.set("core", "moduleConfiguration", returnedTarget)
}
