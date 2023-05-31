import Render from './Render.js';
function getRouteInfo() {
    const hash = location.hash ? location.hash.slice( 1 ) : '';
    const [name, id] = hash.split( `/` );
    return { name, params: { id } };
}
async function handleHash() {
    const { name } = getRouteInfo();
    if ( name ) {
        const routeName = name;
        await Render( routeName );
    }else{
        Render('unknow')
    }
}
export default {
    init() {
        addEventListener( 'hashchange', handleHash );
        handleHash();
    }
}

