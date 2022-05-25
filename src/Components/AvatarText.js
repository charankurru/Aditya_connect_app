import React from "react";
import { Avatar } from "react-native-paper";

const AvatarText = (props) => {
    let { size, name } = props;
    let nameArray = name.split(' ').filter(eachName => eachName.length > 0);
    let textLabel = "A1"
    if (nameArray.length !== 0) {
        textLabel = nameArray.length > 1 ? nameArray[0][0] + nameArray[1][0] : nameArray[0][0]
    }
    textLabel = textLabel.toUpperCase()
    return (
        <Avatar.Text size={size} label={textLabel} color="white" />
    );
};

export default AvatarText;
