var canvases = document.querySelectorAll(".noise_canvas");
for (var i = 0; i < canvases.length; i++) {
    // get attribute "rendered"
    var is_rendered = canvases[i].getAttribute("rendered");
    if (is_rendered == "true") {
        continue;
    }
    else {
        let color = canvases[i].getAttribute("color").split(",").map(Number);
        let opacity = parseFloat(canvases[i].getAttribute("opacity"));
        let complexity = parseFloat(canvases[i].getAttribute("complexity"));
        let density = parseFloat(canvases[i].getAttribute("density"));
        render_noise("#" + canvases[i].id, color, density, opacity, complexity);
        canvases[i].setAttribute("rendered", "true");
    }
}
