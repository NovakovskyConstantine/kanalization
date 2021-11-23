const levelConfigs = [
    {
        level: 1,
        pipeMatrix: [
            [{ type: "none" }, { type: "waterfall" }, { type: "none" }, { type: "none" }],
            [{ type: "duple" }, { type: "duple" }, { type: "finish" }, { type: "finish" }],
            [{ type: "duple" }, { type: "straight" }, { type: "triple" }, { type: "duple"}]
        ]
    },
    {
        level: 2,
        pipeMatrix: [
            [{ type: "none" }, { type: "waterfall" }, { type: "none" }, { type: "none" }],
            [{ type: "duple" }, { type: "cross" }, { type: "triple" }, { type: "finish" }],
            [{ type: "straight" }, { type: "straight" }, { type: "triple" }, { type: "finish" }],
            [{ type: "straight" }, { type: "finish" }, { type: "triple" }, { type: "duple" }],
            [{ type: "finish" }, { type: "finish" }, { type: "duple" }, { type: "finish" }],
        ]
    },
    {
        level: 3,
        pipeMatrix: [
            [{ type: "none" }, { type: "waterfall" }, { type: "none" }, { type: "none" }],
            [{ type: "duple" }, { type: "cross" }, { type: "straight" }, { type: "finish" }],
            [{ type: "straight" }, { type: "triple" }, { type: "finish" }, { type: "finish" }],
            [{ type: "finish" }, { type: "triple" }, { type: "triple" }, { type: "duple" }],
            [{ type: "duple" }, { type: "triple" }, { type: "duple" }, { type: "duple" }],
            [{ type: "finish" }, { type: "duple" }, { type: "finish" }, { type: "finish" }],
        ]
    },
]