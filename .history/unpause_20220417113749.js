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
    const presetButton = document.createElement('button')
    .textContent = "Presets"
    .style.cssText += "flex-shrink:2;"
    .addEventListener("click", myScript)


    wrapper.appendChild(presetButton)



    console.log("wrapped")
}