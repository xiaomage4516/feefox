var GamePDKRule = {

    getCard : function (number) {
        var type = Math.floor(Math.floor(number / 13) + 0.5);
        var type1 = type + 1;
        var value = number - type * 13 + 1;
        var weight = value;
        if (type1 == 5)
            weight = value + 15;
        else if (value <= 2)
            weight = value + 13;
        var voice = weight;
        //A和2的音效是  1 2
        if (value == 1) voice = 1;
        if (value == 2) voice = 2;
        return {
            type: type1,
            value: value,
            number: number,
            name: type + "_" + value,
            weight: weight,
            voice: voice,
            changeToNumber: number % 13,
            isLaizi: false
        };
    },
};

module.exports = GamePDKRule;