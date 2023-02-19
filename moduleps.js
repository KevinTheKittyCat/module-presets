Hooks.once("init", function () {
    // Register custom Modules settings
    game.settings.register("modulePresets", "presets", {
        scope: "world",
        config: false,
        type: Object,
        name: "modulePresets",
        default: {},
        value: "test"
    });
})

Hooks.once('ready', () => {
    checkIfSettingsExists()
    addModulePresetButton()

    // Add Handlebars helper to translate the Json for each preset description.
    Handlebars.registerHelper('noModules', function (value) {
        if (value === "No Modules") return false
        return true;
    });
})

//Add the Preset button beside Foundry's "Manage Modules" Button.
function addModulePresetButton() {
    if (!game.user.isGM) return;
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
        const noModules = { title: "No Modules", id: "No Modules", content: modules, stringified }

        const changedModules = modules
        Object.keys(changedModules).forEach((m) => {
            if (changedModules[m] === "module-presets") changedModules[m] = true
        })

        const OnlyPresetModule = { title: "Only Presets Module", id: "Only Preset", content: modules, stringified }





        game.settings.set("modulePresets", "presets", { presets: [noModules, OnlyPresetModule] })
    }

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

    //Add Event Listener to "bin icon" to delete Preset
    activateListeners(html) {
        super.activateListeners(html);
        let listItems = html[0].querySelectorAll('.list-item')//.getElementById('deletePreset')

        //Add Event Listener to "bin icon" to delete Preset
        listItems.forEach((listItem, i) => {
            listItem.querySelector('.deletePreset')?.addEventListener("click", event => {
                this.deleteEntry(listItem.id)
                $(listItem).remove()
            })

            //Add Event Listener to title and description to select Preset
            listItem.querySelector('.select-group')?.addEventListener("click", event => {
                const content = this.object.presets[i].content

                const modules = game.settings.get("core", "moduleConfiguration")

                const notAlike = Object.keys(modules).filter((m) => modules[m] !== content[m])

                const returnedTarget = Object.assign(modules, content);
                if (notAlike.length === 0) return ui.notifications.warn("That Preset is currently in use.");
                game.settings.set("core", "moduleConfiguration", returnedTarget)
                ui.notifications.info("Reloading Page to apply changes.");
                setTimeout(() => { location.reload() }, 200)
                //window.location.reload()

            })
        })

        const addPresetButton = html[0].querySelector(".addPresetButton")

        addPresetButton.addEventListener("click", event => {
            let form = new titleFormApplication("", {
                popOut: true,
                width: "400px",
                template: "modules/module-presets/form.hbs",
                title: "Preset Name Form",
                //classes: [""]
            })

            form.render(true)
        })
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

    //Add Eventlistener to "add a title" for presets.
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

                            keys.forEach(function (key, i) {
                                if (modules[key] === true && i !== (keys.length - 1)) result += `${key}, `;
                                if (i === (keys.length - 1)) result += `${key}.`
                            })
                            const stringified = result
                            const customId = randomID()

                            const newPreset = { title: formElement.value, content: modules, stringified, id: customId }
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

