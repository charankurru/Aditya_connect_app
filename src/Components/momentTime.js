import moment from "moment";
const momentTime = (currentTime) => {
    let time = moment(currentTime).fromNow()
    return time
}

export default momentTime