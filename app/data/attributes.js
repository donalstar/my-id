(function (exports) {

    exports.getValueAttributes = function () {
        var attributes = [
            {
                name: "ssn",
                values: {long_name: "Social Security #", icon: "fa-legal", panel: "panel-primary"}
            },
            {
                name: "dl",
                values: {long_name: "Drivers License #", icon: "fa-car", panel: "panel-green"}
            },
            {
                name: "fico",
                values: {long_name: "FICO Score", icon: "fa-bank", panel: "panel-red"}
            },
            {
                name: "fb",
                values: {long_name: "Facebook ID", icon: "fa-user", panel: "panel-yellow"}
            },
            {
                name: "address",
                values: {long_name: "Current Address", icon: "fa-user", panel: "panel-green"}
            },
            {
                name: "linkedin",
                values: {long_name: "LinkedIn ID", icon: "fa-user", panel: "panel-yellow"}
            }
        ];

        return attributes;
    };

}(typeof exports === 'undefined' ? this.attributes = {} : exports));