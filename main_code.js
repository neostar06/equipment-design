var reset = document.getElementsByClassName("reset")[0]
var submit = document.getElementsByClassName("submit")[0]
submit.onclick =  function () {
    var shape = document.getElementsByClassName("shape")[0]
    var result = document.getElementById("result")
    var pw = parseFloat(document.getElementsByClassName("pressure")[0].value)
    var liqheight = parseFloat(document.getElementsByClassName("height")[0].value)
    var density = parseFloat(document.getElementsByClassName("density")[0].value)
    var tw = parseFloat(document.getElementsByClassName("temp")[0].value)
    var Do = parseFloat(document.getElementsByClassName("outdiam")[0].value)
    var Di = parseFloat(document.getElementsByClassName("indiam")[0].value)
    var heatingType = document.getElementsByClassName("heatingmethod")[0]
    var f = parseFloat(document.getElementsByClassName("fvalue")[0].value)
    var weldingType = document.getElementsByClassName("jvalue")[0]
    var headType = document.getElementsByClassName("headtype")[0]
    var FlatheadType = document.getElementsByClassName("flatheadtype")[0]
    var ConicalheadType = document.getElementsByClassName("conicalhead")[0]
    var ca = parseFloat(document.getElementsByClassName("cavalue")[0].value)
    var span = document.getElementsByTagName("span")[0]
    var k = heatingType.options[heatingType.selectedIndex].value
    var k2 = weldingType.options[weldingType.selectedIndex].value
    var k0 = shape.options[shape.selectedIndex].value
    var k3 = headType.options[headType.selectedIndex].value
    var k4 = FlatheadType.options[FlatheadType.selectedIndex].value
    var k5 = ConicalheadType.options[ConicalheadType.selectedIndex].value
    var j
    var t
    var tf
    var tstd = [5, 5.5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 25, 28, 32, 36, 40, 45, 50, 56, 63, 71, 80]
    var pd
    var td
    var liqhead = density * liqheight * 9.81 / 1000
    if (liqheight == null) {
        pd = pw * 1.05
    }
    if (liqhead > 0.05 * pw) {
        pd = pw + liqhead
    }
    else {
        pd = pw * 1.05
    }

    if (k === "for unheated parts") {
        td = tw
    }
    else if (k === "for body parts heated by means of steam, hot water or similar") {
        td = tw + 10
    }
    else if (k === "for shielded vessel") {
        td = tw + 20
    }
    else if (k === "for unshielded vessel") {
        td = tw + 50
    }
    else if ( tw < 250) {
        td = 250
    }
    else {
        td = 250
    }
    span.innerHTML = "Design Temperature is :" + td

    if (k2 === "class 1") {
        j = 1
    }
    else if (k2 === "class 1 with single-welded butt-joints with backing strip") {
        j = 0.9
    }
    else if (k2 === "class 2") {
        j = 0.85
    }
    else if (k2 === "class 2 with single-welded butt-joints with backing strip") {
        j = 0.8
    }
    else if (k2 === "class 3 with double-welded butt-joints with full penetration") {
        j = 0.7
    }
    else if (k2 === "class 3 with single-welded butt-joints with backing strip") {
        j = 0.65
    }
    else if (k2 === "class 3 with single-welded butt-joints with backing strip which\n" +
        "            may not remain in place") {
        j = 0.6
    }
    else if (k2 === "class 3 without single-welded butt-joints with backing strip") {
        j = 0.55
    }
    else if (k2 === "class 3 single full lap joints for circumferential seams only") {
        j = 0.5
    }
    var shellConstant = k0 === "Cylinder"? 2 : 4;
    if (Di !== 0 ) {
        t = pd * Di * 1000 / (shellConstant * f * j * 100000000 - pd * 1000)
    }
    else if (Do !== 0 ) {
        t = pd * Do * 1000 / (2 * f * j * 100000000 + pd * 1000)
    }

    if (t < 30) {
        var ta = t * 1000 + ca
    }
    for (var i = 0; i < tstd.length; i++) {
        if (tstd[i] > ta) {
            tf = tstd[i]
            break
        }
    }
    if (Do !== 0) {
        Di = Do - 2 * tf / 1000
    }
    if (Di !== 0) {
        Do = Di + 2 * tf / 1000
    }
    var th, tha, thf, C;

    if (k3 === "Flat head") {
        var De = Di
        if (k4 === "Flanged flat heads butt welded to shell") {
            C = 0.45
        }
        if (k4 === "Plates welded to the inside of the shell") {
            C = 0.55
        }
        if (k4 === "Plates welded to the end of the shell(no inside welding)") {
            C = 0.7
        }
        if (k4 === "Plates welded to the end of the shell(inside welding)") {
            C = 0.55
        }
        if (k4 === "Covers riveted or bolted with full face gaskets to shells") {
            C = 0.42
        }
        th = C * De * Math.pow((pd / (f * 100000)), 0.5)
    }
    else if (k3 === "Conical head") {
        var a, Z;
        if (k5 === "20") {
            a = Math.PI / 9;
            Z = 1.0
        }
        if (k5 === "30") {
            a = Math.PI / 6;
            Z = 1.35
        }
        if (k5 === "45") {
            a = Math.PI / 4;
            Z = 2.05
        }
        if (k5 === "60") {
            a = Math.PI / 3;
            Z = 3.2
        }
        var Dk = Di - Math.pow((Di * tf / (Math.cos(a) * 1000)), 0.5) / Math.sin(a)
        var t1 = pd * Dk *1000 / ((2 * f * j*100000000 - pd*1000) * Math.cos(a))
        var t2 = pd * Di *1000 * Z / (2 * f * j*100000000)
        th = Math.max(t1, t2)
    }
    else if (k3 === "Torispherical(standard dished)and ellipsoidal dished head") {
        var hearray = [0.15, 0.20, 0.25, 0.30, 0.40, 0.50]
        var tarray = [0.002, 0.005, 0.01, 0.02, 0.04]
        var Carray = [
            [4.55, 2.66, 2.15, 1.95, 1.75],
            [2.30, 1.70, 1.45, 1.37, 1.32],
            [1.38, 1.14, 1.00, 1.00, 1.00],
            [0.92, 0.77, 0.77, 0.77, 0.77],
            [0.59, 0.59, 0.59, 0.59, 0.59],
            [0.55, 0.55, 0.55, 0.55, 0.55]
        ]
        var Ro,Ri,ro,heado,thead,head,he,q = 0,ac;
        Ri=Do
        Ro = Ri
        ro = 0.06* Do
        head = pd / (2*f*j*100000)
        do {
            heado = Ro - Math.pow(((Ro - Do/2)*(Ro+Do/2-2*ro)),0.5)
            he = Math.min(heado,Do*Do/(4*Ro),Math.pow(Do*ro/2,0.5))
            for(var l=0; l<hearray.length; l++) {
                if (hearray[l] > (he / Do)) {
                    ac = l-1
                    break
                }
            }
            for(var m=0; m<tarray.length;m++){
                if( Carray[ac][m]*head-tarray[m]<0.001){
                    C = Carray[ac][m]
                    break
                }
            }
            thead = head * C * Do
            tha = (thead * 1000 + ca) * 1.06
            for (var i = 0; i < tstd.length; i++) {
                if (tstd[i] > tha) {
                    thf = tstd[i]
                    break
                }
            }
            Ro = Ri + thf
            ro  =   0.06*Do + thf

            q++;
        }
        while (q < 5);
    }
    tha = (th * 1000 + ca) * 1.06
    for (var i = 0; i < tstd.length; i++) {
        if (tstd[i] > tha) {
            thf = tstd[i]
            break
        }
    }
    console.log(thf)

    var d0 = document.getElementsByClassName("nozzlediam")[0].value
    var h1 = document.getElementsByClassName("nozzleinside")[0].value
    var h2 = document.getElementsByClassName("nozzleoutside")[0].value
    var tn = document.getElementsByClassName("nozzlethickness")[0].value
    var di = d0 - 2 * tn / 1000
    var basicarea = (di + 2*ca / 1000) * t / 1000
    var excessarea = (di + 2*ca / 1000) * (tf - t - ca) / 1000
    var hi = Math.pow((di+2*ca/1000)*(tn - ca)/1000,0.5)
    var ho = Math.pow((di+2*ca/1000)*(tn - 2*ca)/1000,0.5)
    var H1 = Math.min(h1,hi)
    var H2 = Math.min(h2,ho)
    var tr = pd * d0 *1000000 / (2*f*j*100000000 + pd*1000)
    var Ae = 2*H2*(tn-2*ca)/1000
    var Ai = 2*H1*(tn-tr-2*ca)/1000
    var compensatedarea = Ai +Ae + excessarea
    var requiredcompensation = compensatedarea - basicarea


    result.innerHTML = "the required compensation is=" + requiredcompensation + "the thickness of shell="
        + tf + "the thickness of head="+thf
}




