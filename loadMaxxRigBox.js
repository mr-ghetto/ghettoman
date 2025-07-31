// 

export async function loadMaxxRigBox(basePath = './') {
    const spine = await import('https://esotericsoftware.com/files/runtimes/spine-ts/spine-threejs/dist/spine-threejs.esm.js');
    const { SkeletonRenderer, AssetManager, AnimationState, AnimationStateData, SkeletonMesh, SceneRenderer } = spine;

    // Asset manager
    const assetManager = new spine.AssetManager(basePath);
    assetManager.loadTextureAtlas('MaxxRigBox.atlas');
    assetManager.loadJson('MaxxRigBox.json');

    // Wait for assets to load
    await new Promise(resolve => {
        const check = () => {
            if (assetManager.isLoadingComplete()) resolve();
            else requestAnimationFrame(check);
        };
        check();
    });

    // Get loaded data
    const atlas = assetManager.get('MaxxRigBox.atlas');
    const skeletonJson = assetManager.get('MaxxRigBox.json');
    const atlasLoader = new spine.AtlasAttachmentLoader(atlas);
    const skeletonParser = new spine.SkeletonJson(atlasLoader);
    const skeletonData = skeletonParser.readSkeletonData(skeletonJson);

    // Create skeleton and animation state
    const skeleton = new spine.Skeleton(skeletonData);
    skeleton.setToSetupPose();
    skeleton.updateWorldTransform();

    const animationStateData = new spine.AnimationStateData(skeleton.data);
    const animationState = new spine.AnimationState(animationStateData);
    animationState.setAnimation(0, 'idle', true); // Change 'idle' to your animation name

    // Create Three.js-compatible renderer group
    const skeletonRenderer = new SkeletonRenderer();
    const group = new THREE.Group();

    // Use a custom canvas to render to texture or implement render-to-geometry
    // For now, log the skeleton
    console.log('✅ MaxxRigBox loaded:', skeleton);

    // You would need to write a render loop that calls:
    // animationState.update(delta);
    // animationState.apply(skeleton);
    // skeleton.updateWorldTransform();
    // skeletonRenderer.draw(skeleton);

    // For now, return all useful parts
    return {
        skeleton,
        animationState,
        skeletonData,
        group, // placeholder
        skeletonRenderer,
    };
}