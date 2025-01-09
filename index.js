const imagesToPreload = ["analytics","building","buy-a-house","clouds",
    "home","mixer-truck","solar-battery","solar-panel","sun","sunrise","weather"];

imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = "assets/"+src+".gif";
});

const form = document.getElementById('solarForm');
const submitButton = document.getElementById('submitButton');

const optionsGroups = {
    buildingType: document.getElementById('buildingTypeOptions'),
    roofType: document.getElementById('roofTypeOptions'),
    shade: document.getElementById('shadeOptions'),
};

const inputs = {
    buildingType: null,
    roofType: null,
    shade: null,
    roofArea: document.getElementById('roofArea'),
};

document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const parent = this.parentElement;
        parent.querySelectorAll('.option').forEach(opt => opt.classList.remove('selected'));
        this.classList.add('selected');
        const key = Object.keys(optionsGroups).find(k => optionsGroups[k] === parent);
        inputs[key] = this.dataset.value;
        validateForm();
    });
});

document.querySelectorAll('.option,.result-item').forEach(option => {
    option.addEventListener('mouseover', function () {
        const img = this.querySelector('img');
        if (img) {
            const originalSrc = img.getAttribute('src');
            const hoverSrc = originalSrc.replace('.jpg', '.gif');
            img.setAttribute('data-original-src', originalSrc);
            img.setAttribute('src', hoverSrc);
        }
    });

    option.addEventListener('mouseout', function () {
        const img = this.querySelector('img');
        if (img) {
            const originalSrc = img.getAttribute('data-original-src');
            img.setAttribute('src', originalSrc);
        }
    });
});

inputs.roofArea.addEventListener('input', validateForm);

function validateForm(){
    const roofAreaValid = inputs.roofArea.value && parseInt(inputs.roofArea.value, 10) >= 50;
    const isFormValid = roofAreaValid && Object.values(inputs).every(value => value);
    submitButton.disabled = !isFormValid;
}

document.getElementById('solarForm').addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('results').style.display = 'block';
    //חישוב
    const {buildingType,roofType,shade,roofArea} = inputs
    const area = roofArea.value

    const roofFactors = {
        'רעפים': 6.5,
        'בטון': 7.5,
        'איסכורית': 7,
    };

    const shadeFactors = {
        'אין': 1,
        'מעט': 0.85,
        'הרבה': 0.6,
    };

    const revenueFactors = {
        'ביתי': 0.48,
        'מסחרי': 0.44,
    };

    const revenuePerArea = {
        'אין': 1700,
        'מעט': 1500,
        'הרבה': 1350,
    };

    const annualCostFactors = {
        'ביתי': 4000,
        'מסחרי': 3500,
    };

    const roofFactor = roofFactors[roofType] || 0;
    const shadeFactor = shadeFactors[shade] || 0;
    const systemSize = (area / roofFactor) * shadeFactor;

    const revenueFactor = revenueFactors[buildingType] || 0;
    const annualRevenue = systemSize * revenuePerArea[shade] * revenueFactor;

    const annualCost = annualCostFactors[buildingType] || 0;
    const roi = (annualRevenue / annualCost) * 100;

    document.getElementById('systemSize').textContent = systemSize.toFixed(2) + ' KWP';
    document.getElementById('annualRevenue').textContent = annualRevenue.toFixed(2) + ' ₪';
    document.getElementById('roi').textContent = roi.toFixed(2) + '%';
});
