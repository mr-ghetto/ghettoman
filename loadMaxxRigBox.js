export async function loadMaxxRigBox(basePath = './') {
    const spine = await import('https://esotericsoftware.com/files/runtimes/spine-ts/spine-threejs/dist/spine-threejs.esm.js');

    const {
        Skeleton,
        AnimationState,
        AnimationStateData,
        AssetManager,
        SkeletonRenderer,
        AtlasAttachmentLoader,
        SkeletonJson
    } = spine;

    const assetManager = new AssetManager(basePath);
    assetManager.loadTextureAtlas('MaxxRigBox.atlas');
    assetManager.loadJson('MaxxRigBox.json');

    // Wait for all assets to load
    await new Promise(resolve => {
        const check = () => {
            if (assetManager.isLoadingComplete()) resolve();
            else requestAnimationFrame(check);
        };
        check();
    });

    const atlas = assetManager.get('MaxxRigBox.atlas');
    const json = assetManager.get('MaxxRigBox.json');

    const atlasLoader = new AtlasAttachmentLoader(atlas);
    const jsonReader = new SkeletonJson(atlasLoader);
    const skeletonData = jsonReader.readSkeletonData(json);

    const skeleton = new Skeleton(skeletonData);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();

    const stateData = new AnimationStateData(skeleton.data);
    const animationState = new AnimationState(stateData);
    animationState.setAnimation(0, 'idle', true); // change 'idle' to your animation name

    const renderer = new SkeletonRenderer();

    // Return all key pieces
    return {
        skeleton,
        animationState,
        skeletonData,
        renderer
    };
}
