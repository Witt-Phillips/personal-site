class Slider {
    constructor(sliders, label, description, min = 0, max = 2, start = 1, step = 0.05, width = 80, x = 50, y = 0) {
        //position already written to
        if (sliders.length === 0) {
            y = height - 50;
        } else {
            y = sliders[sliders.length - 1].pos.y - 30;
        }
        this.pos = createVector(x, y);
        this.width = width;
        this.label = label;
        this.description = description;
        this.slider = createSlider(min, max, start, step)
                      .addClass('mySliders')
                      .position(this.pos.x, this.pos.y)
                      .size(this.width);
    }

    updatePosition() {
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