document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for each input box
    ['in1', 'in2', 'in3'].forEach(function(id) {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateFloatingPointRepresentation(id);
            }
        });
    });

    ['sign1', 'sign2', 'sign3','mantissa1', 'mantissa2', 'mantissa3','exp1', 'exp2', 'exp3'].forEach(function(id) {
        document.getElementById(id).addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                updateDecimalBox(id);
            }
        });
    });
});

function updateDecimalBox(inputId) {
    let numericPart = inputId.match(/\d+/)[0];

    let signId = 'sign' + numericPart;
    let mantissaId = 'mantissa' + numericPart;
    let exponentId = 'exp' + numericPart;
    let inId = 'in' + numericPart;

    let sign = document.getElementById(signId).value;
    let mantissa = document.getElementById(mantissaId).value;
    let exponent = document.getElementById(exponentId).value;
    let exponentDecimal = parseInt(exponent, 2) - 63;
    let mantDecimal = binaryFractionToDecimal(mantissa);
    let signChar = sign === '1' ? '-' : '+';

    document.getElementById(inId).value = mantDecimal * (2 ** (exponentDecimal));

    document.getElementById(inId.replace('in', 'sign')).value = sign;
    document.getElementById(inId.replace('in', 'mantissa')).value = mantissa;
    document.getElementById(inId.replace('in', 'exp')).value = exponent;

    document.getElementById(inId.replace('in','signOut')).innerText = signChar;
    document.getElementById(inId.replace('in','mantissaOut')).innerText = mantDecimal;
    document.getElementById(inId.replace('in','expOut')).innerText = exponentDecimal;
}

function updateFloatingPointRepresentation(inputId) {
    let number = parseFloat(document.getElementById(inputId).value);
    if (isNaN(number)) {
        // Handle non-numeric input
        return;
    }

    let fpRepresentation = floatToCustomFp(number);
    let parts = fpRepresentation.split(' ');

    // Extract components of the floating-point representation
    let sign = number < 0 ? '1' : '0';
    let signChar = sign === '1' ? '-' : '+';
    let hiddenBit = parts[0].substring(0, 1);
    let mantissa = parts[0].substring(2);
    let exponent = parts[1];

    let exponentDecimal = parseInt(exponent, 2) - 63;
    let mantDecimal = binaryFractionToDecimal(mantissa);

    // Update the respective input boxes
    document.getElementById(inputId.replace('in', 'sign')).value = sign;
    document.getElementById(inputId.replace('in', 'hidden')).value = hiddenBit;
    document.getElementById(inputId.replace('in', 'mantissa')).value = mantissa;
    document.getElementById(inputId.replace('in', 'exp')).value = exponent;

    document.getElementById(inputId.replace('in','signOut')).innerText = signChar;
    document.getElementById(inputId.replace('in','mantissaOut')).innerText = mantDecimal;
    document.getElementById(inputId.replace('in','expOut')).innerText = exponentDecimal;
}

function isPowerOfTwo(n) {
    // Check if a number is a power of two
    return n > 0 && (Math.log2(n) % 1 === 0);
}

function floatToCustomFp(number) {
    let exponent, mantissaBinary;

    if (isPowerOfTwo(number)) {
        exponent = Math.floor(Math.log2(number));
        mantissaBinary = '0'.repeat(7); // All zeros for powers of two
    } else {
        exponent = Math.floor(Math.log2(Math.abs(number)));
        let normalizedMantissa = Math.abs(number) / Math.pow(2, exponent);
        let truncatedMantissa = Math.floor((normalizedMantissa - 1) * Math.pow(2, 7));
        mantissaBinary = truncatedMantissa.toString(2).padStart(7, '0');
    }

    let bias = 63;
    let adjustedExponent = exponent + bias;
    let exponentBinary = adjustedExponent.toString(2).padStart(7, '0');

    return `1.${mantissaBinary} ${exponentBinary}`;
}

function binaryFractionToDecimal(binaryFraction) {
    let decimal = 0;
    let fractionPart = binaryFraction;

    // Convert the fractional part
    for (let i = 0; i < fractionPart.length; i++) {
        decimal += (fractionPart[i] === '1' ? 1 : 0) * Math.pow(2, -(i + 1));
    }
    return decimal + 1;
}