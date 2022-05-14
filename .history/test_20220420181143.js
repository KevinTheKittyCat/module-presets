Hooks.once('ready', () => {
    checkIfSettingsExists()
    addModulePresetButton()
    //makePreset()
    Handlebars.registerHelper('json', function (context) {
        return JSON.stringify(context);
    });

    Handlebars.registerHelper('textField', function (options) {
        /*var dom = '<input type="text">', attribs;
        console.log(options)
        
        attribs = JSON.parse(options.hash.dataAttribs);
        //console.log(attribs.text + " -- " + attribs.class);
        
        return new Handlebars.SafeString(dom);*/
        $(document.body).on("submit", "#myForm", function () {
            console.log("HERE IN OPTIONS")
            const name = $("#textInput")
            console.log(name)
        });
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
    console.log("hello")
}


function openModulePresets() {

    let context = game.settings.get("modulePresets", "presets");
    console.log(context)
    let test = new MyFormApplication(context, {
        popOut: true,
        width: "400px",
        template: "modules/module-presets/test.hbs",
        title: "test",
        classes: ["preset-browser"]
    })
    console.log(test)
    test.render(true)
}

function checkIfSettingsExists() {
    //const setting = game.settings.storage.get("world").find(w => w.key === "modulePresets.presets")
    const setting = game.settings.settings.has(`modulePresets.presets`)
    if (!setting) {
        // TODO make setting if no setting
        game.settings.register("modulePresets", "presets", {
            scope: "world",
            config: false,
            type: Object,
            //name: "modulePresets"
            //value: [{ title: "No Modules", content: {} }]
        });
        //console.log("got here in setting")

        const stringified = "No Modules"// JSON.stringify(content)
        game.settings.set("modulePresets", "presets", { presets: [{ title: "No Modules", content: {}, stringified }] })
    }
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


window.makePreset = async () => {
    //modules = game.modules
    const modules = game.settings.get("core", "moduleConfiguration")
    const presetsObj = game.settings.get("modulePresets", "presets")

    let result = ""
    const keys = Object.keys(modules);
    keys.forEach(function (key) {
        result += `${key}:${modules[key]} `
    })
    const stringified = result

    console.log(result)
    let naaaame = ""

    /*
    let name = await new Promise((resolve, reject) => {
        new MyFormApplication(naaaame, {
            popOut: true,
            width: "400px",
            template: "modules/module-presets/form.hbs",
            title: "form",
            //classes: [""]
        })

        let appNameing = await $(document.body).on("submit", "#myForm", function () {
            console.log("HERE IN OPTIONS")
            const namesing = $("#textInput")
            console.log(namesing)
            //return namesing
        });

        console.log(appNameing)
        resolve(appNameing)
    })*/

    console.log(name)

    console.log("naaaame")
    name.render(true);
    //const name = await prompt("Please enter your name", "Harry Potter")
    const newPreset = [{ title: name, content: { modules }, stringified }]
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

window.myFunc = () => {
    var formText = $("#textInput").val();
    console.log("Herererere")
    // Do something with formText
}
