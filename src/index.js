function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    return bracketsParcer(expr)
}

const bracketsParcer = (str) => {
    if (String(str).match(/[(,)]/g) !== null) {
        if (str.match(/[(]/g) !== null & str.match(/[)]/g) !== null) {
            if (str.match(/[(]/g).length === str.match(/[)]/g).length) {
                let leftBracketPos = str.indexOf('(')
                let rightBracketPos = str.indexOf(')')
                let i = 0
                while (i < rightBracketPos) {
                    if (str[i] === '(') {
                        leftBracketPos = i
                    }
                    i++
                }
                const strFromBrackets = str.slice(leftBracketPos + 1, rightBracketPos)
                str = str.slice(0, leftBracketPos) + calculateStr(strFromBrackets) + str.slice(rightBracketPos + 1)
                return bracketsParcer(str)
            }
            else if (str.match(/[(]/g).length !== str.match(/[)]/g).length) {
                throw new Error("ExpressionError: Brackets must be paired")
            }
        }
        else {
            throw new Error("ExpressionError: Brackets must be paired")
        }
    }
    return calculateStr(str)
}

const calculateStr = (str) => {
    str = String(str).replace(/\s/g, '');
    str = String(str).replace(/^[-]/, '~')
    str = String(str).replace(/[/]{1}-/g, '/~')
    str = String(str).replace(/[*]{1}-/g, '*~')
    str = String(str).replace(/-{2}/g, '+')
    const pattern = /[*/+-]/g
    if (String(str).match(pattern) !== null) {
        let operatorsArr = String(str).match(pattern)
        let nums = String(str).split(pattern)
        if (operatorsArr !== null) {
            if (operatorsArr.includes('*') || operatorsArr.includes('/')) {
                if (operatorsArr.indexOf('*') < operatorsArr.indexOf('/')) {
                    if (operatorsArr.includes('*')) {
                        return calculateStr(multiply(operatorsArr, str, nums))
                    }
                    else if (operatorsArr.includes('/')) {
                        return calculateStr(divide(operatorsArr, str, nums))
                    }
                }
                else {
                    if (operatorsArr.includes('/')) {
                        return calculateStr(divide(operatorsArr, str, nums))
                    }
                    else if (operatorsArr.includes('*')) {
                        return calculateStr(multiply(operatorsArr, str, nums))
                    }
                }
            }
            else if (operatorsArr.includes('+') || operatorsArr.includes('-')) {
                switch (operatorsArr[0]) {
                    case '+':
                        return calculateStr(plus(operatorsArr, str, nums))
                    case '-':
                        if (nums[0].length > 0) {
                            return calculateStr(minus(operatorsArr, str, nums))
                        }
                        else return String(str).includes('.') ?
                            String(str).split('.').pop().length > 4 ? Number(parseFloat(str)) : Number(parseFloat(str))
                            : Number(parseInt(str))
                    default: return;
                }
            }
        }
        return String(str).includes('.') ?
            String(str).split('.').pop().length > 4 ? Number(parseFloat(str)) : Number(parseFloat(str))
            : Number(parseInt(str))
    }
    if (String(str).includes('~')) {
        str = String(str).replace('~', '-')
    }
    return String(str).includes('.') ?
        String(str).split('.').pop().length > 4 ? Number(parseFloat(str)) : Number(parseFloat(str))
        : Number(parseInt(str))
}

const multiply = (operatorsArr, str, nums) => {
    const operatorPosition = operatorsArr.indexOf('*')
    if (nums[operatorPosition].includes('~') || nums[operatorPosition + 1].includes('~')) {
        nums[operatorPosition] = nums[operatorPosition].replace('~', '-')
        nums[operatorPosition + 1] = nums[operatorPosition + 1].replace('~', '-')
    }
    let partResult = Number(nums[operatorPosition]) * Number(nums[operatorPosition + 1])
    partResult = partResult < 0 ? "~" + Math.abs(partResult) : partResult
    return String(str).slice(0, str.indexOf('*') - nums[operatorPosition].length) + partResult
        + String(str).slice(str.indexOf('*') + nums[operatorPosition + 1].length + 1)
}

const divide = (operatorsArr, str, nums) => {
    const operatorPosition = operatorsArr.indexOf('/')
    if (nums[operatorPosition].includes('~') || nums[operatorPosition + 1].includes('~')) {
        nums[operatorPosition] = nums[operatorPosition].replace('~', '-')
        nums[operatorPosition + 1] = nums[operatorPosition + 1].replace('~', '-')
    }
    if (Number(nums[operatorPosition + 1]) === 0) {
        throw new Error("TypeError: Division by zero.")
    }
    let partResult = Number(nums[operatorPosition]) / Number(nums[operatorPosition + 1])
    partResult = partResult < 0 ? "~" + Math.abs(partResult).toFixed(10) : partResult
    return String(str).slice(0, str.indexOf('/') - nums[operatorPosition].length) + partResult + String(str).slice(str.indexOf('/') + nums[operatorPosition + 1].length + 1)
}

const plus = (operatorsArr, str, nums) => {
    const operatorPosition = operatorsArr.indexOf('+')
    if (nums[operatorPosition].includes('~') || nums[operatorPosition + 1].includes('~')) {
        nums[operatorPosition] = nums[operatorPosition].replace('~', '-')
        nums[operatorPosition + 1] = nums[operatorPosition + 1].replace('~', '-')
    }
    let partResult = Number(nums[operatorPosition]) + Number(nums[operatorPosition + 1])
    partResult = partResult < 0 ? "~" + Math.abs(partResult) : partResult
    return String(str).slice(0, str.indexOf('+') - nums[operatorPosition].length) + partResult + String(str).slice(str.indexOf('+') + nums[operatorPosition + 1].length + 1)
}

const minus = (operatorsArr, str, nums) => {
    const operatorPosition = operatorsArr.indexOf('-')
    if (nums[operatorPosition].includes('~') || nums[operatorPosition + 1].includes('~')) {
        nums[operatorPosition] = nums[operatorPosition].replace('~', '-')
        nums[operatorPosition + 1] = nums[operatorPosition + 1].replace('~', '-')
    }
    let partResult = Number(nums[operatorPosition]) - Number(nums[operatorPosition + 1])
    partResult = partResult < 0 ? "~" + Math.abs(partResult) : partResult
    return String(str).slice(0, str.indexOf('-') - nums[operatorPosition].length) + partResult + String(str).slice(str.indexOf('-') + nums[operatorPosition + 1].length + 1)
}

module.exports = {
    expressionCalculator
}