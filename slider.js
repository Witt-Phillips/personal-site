class Slider {
    constructor(sliders, label, description, min = 0, max = 2, start = 1, step = 0.05, width = 80, x = 50) {
        //position already written to
        this.width = width;
        this.label = label;
        this.description = description;
        this.slider = createSlider(min, max, start, step)
                      .addClass('mySliders')
                      .size(this.width);
        this.updatePosition(sliders.length);
    }

    updatePosition(idx) {
        this.pos = createVector(50, height - 50 - (30 * idx));
        this.slider.position(this.pos.x, this.pos.y); // TODO - window height thing here?
    }

    displayLabel() {
        textSize(14);
        textAlign(LEFT, CENTER);
        text(this.label, this.pos.x + this.width + 20, this.pos.y + 5); // TODO: height thing here?
    }

    displayDescription() {
        textSize(14);
        textAlign(LEFT, CENTER);
        text(this.description, this.pos.x + this.width + textWidth(this.label) + 30, this.pos.y + 5);
    }
}