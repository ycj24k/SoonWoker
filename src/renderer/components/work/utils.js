/**
 * Work component utilities
 */

export function extendStringPrototypes() {
    if (String.prototype.strLen) return;

    String.prototype.strLen = function () {
        var len = 0
        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) len += 2
            else len++
        }
        return len
    }

    String.prototype.strToChars = function () {
        var chars = new Array()
        for (var i = 0; i < this.length; i++) {
            chars[i] = [this.substr(i, 1), this.isCHS(i)]
        }
        String.prototype.charsArray = chars
        return chars
    }

    String.prototype.isCHS = function (i) {
        if (this.charCodeAt(i) > 255 || this.charCodeAt(i) < 0) return true
        else return false
    }

    String.prototype.subCHString = function (start, end) {
        var len = 0
        var str = ''
        this.strToChars()
        for (var i = 0; i < this.length; i++) {
            if (this.charsArray[i][1]) len += 2
            else len++
            if (end < len) return str
            else if (start < len) str += this.charsArray[i][0]
        }
        return str
    }

    String.prototype.subCHStr = function (start, length) {
        return this.subCHString(start, start + length)
    }
}

export function getNowFormatDate() {
    var date = new Date()
    var seperator1 = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate
    }
    return year + seperator1 + month + seperator1 + strDate
}

export function genTaskUUID() {
    var myDate = new Date()
    var dateStr =
        myDate.getFullYear().toString() +
        (myDate.getMonth() + 1 >= 10 ? (myDate.getMonth() + 1).toString() : '0' + (myDate.getMonth() + 1).toString()) +
        (myDate.getDate() > 9 ? myDate.getDate().toString() : '0' + myDate.getDate().toString()) +
        (myDate.getHours() > 9 ? myDate.getHours().toString() : '0' + myDate.getHours().toString()) +
        (myDate.getMinutes() > 9 ? myDate.getMinutes().toString() : '0' + myDate.getMinutes().toString()) +
        (myDate.getSeconds() > 9 ? myDate.getSeconds().toString() : '0' + myDate.getSeconds().toString()) +
        myDate.getTime().toString().slice(-2);
    return dateStr
}
