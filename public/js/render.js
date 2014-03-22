
function draw(attributes){
    var canvas = document.getElementById('graph');
    canvas.width = canvas.width;
    var cxt = canvas.getContext('2d');
    // Hexagon Parameters
    var numberOfSides = 6,
        osize = 60,
        size = osize,
        Xcenter = 60,
        Ycenter = 60,
        layers = 7;

    var height = osize*Math.sin(Math.PI/3);

    canvas.width = Xcenter + osize;
    canvas.height = Ycenter + height * 2;
    
    var boxWidth = 4;
    var points = [];

    for (var j = layers; j > 0; j--){
        size = osize * j / layers;
        cxt.beginPath();
        cxt.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));
        var layer = [];
        for (var i = 1; i <= numberOfSides;i += 1) {
            cxt.lineTo(Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
            layer[i] = [Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides)];
            points[j] = layer;
        }
        cxt.strokeStyle = "#000000";
        cxt.lineWidth = 1;
        cxt.stroke();
        cxt.globalAlpha=0.5;
        cxt.fillStyle = "#d4f1e0";
        cxt.closePath();
        cxt.fill();
    }

    // Plot Attributes
    var stats = [
        attributes["willpower"]/2 - 1,
        attributes["vitality"]/2 - 1,
        attributes["strength"]/2 - 1,
        attributes["agility"]/2 - 1,
        attributes["alertness"]/2 - 1,
        attributes["intelligence"]/2 - 1
    ];
    cxt.beginPath();
    for (var j = 0; j < 6; j++){
        cxt.lineTo(points[stats[j]][j+1][0], points[stats[j]][j+1][1]);
    }
    cxt.globalAlpha=0.5;
    cxt.fillStyle = "#ffffff";
    cxt.closePath();
    cxt.fill();
    cxt.globalAlpha=1;
    cxt.strokeStyle = "#00E5EE";
    cxt.lineWidth = 1.2;
    cxt.stroke();

    // Plot points
    for (var j = 0; j < 6; j++){
        cxt.fillStyle="#00688B";
        cxt.fillRect(points[stats[j]][j+1][0] - boxWidth/2, points[stats[j]][j+1][1] - boxWidth/2,boxWidth,boxWidth);
    }

    // Draw Derived Attribute Lines
    cxt.globalAlpha=0.5;
    cxt.lineWidth = 4;
    cxt.beginPath();
    cxt.moveTo(Xcenter, Ycenter);
    cxt.lineTo(Xcenter, Ycenter+(height*(stats[0] + stats[1])/(2*layers)));
    cxt.closePath();
    cxt.strokeStyle = "#FC1501";
    cxt.stroke();
    cxt.beginPath();
    cxt.moveTo(Xcenter, Ycenter);
    cxt.lineTo(Xcenter, Ycenter-(height*(stats[3] + stats[4])/(2*layers)));
    cxt.closePath();
    cxt.strokeStyle = "#473C8B";
    cxt.stroke();
}