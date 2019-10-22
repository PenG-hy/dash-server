// created by may.lim Oct 2019

var HighestBitrateRule;

// Rule that selects the highest possible bitrate
function HighestBitrateRuleClass() {

    let factory = dashjs.FactoryMaker;
    let SwitchRequest = factory.getClassFactoryByName('SwitchRequest');
    let MetricsModel = factory.getSingletonFactoryByName('MetricsModel');
    let StreamController = factory.getSingletonFactoryByName('StreamController');
    let context = this.context;
    let instance;

    function setup() {
    }

    // Always use highest bitrate
    function getMaxIndex(rulesContext) {
        // here you can get some information about metrics for example, to implement the rule
        let metricsModel = MetricsModel(context).getInstance();
        var mediaType = rulesContext.getMediaInfo().type;
        var metrics = metricsModel.getReadOnlyMetricsFor(mediaType);

        // A smarter (real) rule could need analyze playback metrics to take
        // bitrate switching decision. Printing metrics here as a reference
        console.log('[HighestBitrateRule] Logging metrics..');
        console.log(metrics);

        // Get current bitrate
        let streamController = StreamController(context).getInstance();
        let abrController = rulesContext.getAbrController();
        let current = abrController.getQualityFor(mediaType, streamController.getActiveStreamInfo());

        // If already in highest bitrate, don't do anything
        if (current === 0) {    // ### todo
            return SwitchRequest(context).create();
        }

        // Ask to switch to the highest bitrate
        let switchRequest = SwitchRequest(context).create();
        switchRequest.quality = 0;  // ### todo
        switchRequest.reason = 'Always switching to the highest bitrate';
        switchRequest.priority = SwitchRequest.PRIORITY.STRONG;
        return switchRequest;
    }

    instance = {
        getMaxIndex: getMaxIndex
    };

    setup();

    return instance;
}

HighestBitrateRuleClass.__dashjs_factory_name = 'HighestBitrateRule';
HighestBitrateRule = dashjs.FactoryMaker.getClassFactory(HighestBitrateRuleClass);