export function blendRGBColors(c0, c1, p) {
    let f=c0.split(","),t=c1.split(","),R=parseInt(f[0].slice(4), 10),G=parseInt(f[1], 10),B=parseInt(f[2], 10);
    return "rgb("+(Math.round((parseInt(t[0].slice(4), 10)-R)*p)+R)+","+(Math.round((parseInt(t[1], 10)-G)*p)+G)+","+(Math.round((parseInt(t[2], 10)-B)*p)+B)+")";
}
