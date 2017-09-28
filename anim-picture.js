const images = 8;
let count = 1;

const createGeometry = size => [
    { x: -size, y: size, z: size },
    { x: -size, y: -size, z: size },
    { x: size, y: size, z: size },
    { x: -size, y: -size, z: size },
    { x: size, y: -size, z: size },
    { x: size, y: size, z: size }
];

const getRandom = value => Math.random() * value - value / 2;

const loadImage = callback => {
    const image = new Image();
    image.onload = () => {
        count += count === images ? -(images - 1) : 1;
        callback(image);
    };
    image.crossOrigin = "Anonymous";
    image.src = `https://use-the-platform.com/webp/images/${count}`;
};

const initialize = image => {
    const canvas = document.querySelector("canvas");
    const grid = 200;
    const size = 0.004;
    const step = 0.004;
    const duration = 0.4;

    const imageRatio = image.width / image.height;
    const geometry = createGeometry(size);
    const gridRatio = Math.ceil(grid / imageRatio);
    const multiplier = gridRatio * grid;

    let texture;
    let forward = false;

    const attributes = [{
            name: "aPositionStart",
            data: i => [
                (-((grid - 1) / 2) + i % grid) / (0.5 / size),
                ((gridRatio - 1) / 2 - Math.floor(i / grid)) / (0.5 / size),
                0.0
            ]
        },
        {
            name: "aControlPointOne",
            data: () => [getRandom(2), getRandom(2), 0]
        },
        {
            name: "aControlPointTwo",
            data: () => [getRandom(2), getRandom(2), 0]
        },
        {
            name: "aPositionEnd",
            data: () => [0, 0, -10]
        },
        {
            name: "aOffset",
            data: i => [i * ((1 - duration) / (multiplier - 1))]
        },
        {
            name: "aTextureCoord",
            data: i => [(i % grid) / grid, Math.floor(i / grid) / gridRatio]
        }
    ];

    const uniforms = [{
        name: "uProgress",
        type: "float",
        value: 1.0
    }];

    const vertexShader = `
    attribute vec3 position;
    attribute vec3 aPositionStart;
    attribute vec3 aControlPointOne;
    attribute vec3 aControlPointTwo;
    attribute vec3 aPositionEnd;
    attribute float aOffset;
    attribute float aAngle;

    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;

    uniform float uProgress;
    uniform mat4 uMVP;

    vec3 bezier4(vec3 a, vec3 b, vec3 c, vec3 d, float t) {
      return mix(mix(mix(a, b, t), mix(b, c, t), t), mix(mix(b, c, t), mix(c, d, t), t), t);
    }

    float easeInOutSin(float t){
      return (1.0 + sin(3.142 * t - 3.142 / 2.0)) / 2.0;
    }

    void main () {
      float tProgress = easeInOutSin(min(1.0, max(0.0, (uProgress - aOffset)) / ${duration}));
      vec3 newPosition = bezier4(aPositionStart, aControlPointOne, aControlPointTwo, aPositionEnd, tProgress);
      gl_Position = uMVP * vec4(newPosition + position, 1.0);

      vTextureCoord = aTextureCoord;
    }
  `;

    const fragmentShader = `
    precision mediump float;

    uniform sampler2D uSampler;
    varying vec2 vTextureCoord;

    void main() {
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
  `;

    const onSetup = gl => {
        texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);
    };

    const onRepeat = (gl, program) => {
        const uSampler = gl.getUniformLocation(program, "uSampler");
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(uSampler, 0);

        if (uniforms[0].value > 1) {
            loadImage(newImage => {
                gl.texImage2D(
                    gl.TEXTURE_2D,
                    0,
                    gl.RGB,
                    gl.RGB,
                    gl.UNSIGNED_BYTE,
                    newImage
                );
            });
            forward = false;
        } else if (uniforms[0].value < -0.2) {
            forward = true;
        }
        uniforms[0].value += forward ? step : -step;
    };

    const textureCoordLayout = [
        false,
        true,
        false,
        false,
        true,
        true,
        false,
        false,
        true,
        false,
        true,
        true
    ];

    const modifier = {
        attribute: "aTextureCoord",
        value: (attributeBufferDataOffset, attributeData, l, k) => {
            const current = textureCoordLayout[k * 2 + l];
            if (l === 1) {
                return !current ?
                    attributeData[1] + imageRatio / grid :
                    attributeData[1];
            }
            return current ? attributeData[0] + 1 / grid : attributeData[0];
        }
    };

    starlings(
        canvas,
        geometry,
        multiplier,
        attributes,
        uniforms,
        vertexShader,
        fragmentShader,
        onSetup,
        onRepeat,
        modifier
    );
};

loadImage(initialize);