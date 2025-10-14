var separator = ' - ', dateFormat = 'DD/MM/YYYY';
var isMobile = $(window).width() <= 575;
var checkInPicker, checkOutPicker;

function initializeDatePickers() {
    // Destroy existing pickers if any
    if ($('input[name="value_from_start_date"]').data('daterangepicker')) {
        $('input[name="value_from_start_date"]').data('daterangepicker').remove();
    }
    if ($('input[name="value_from_end_date"]').data('daterangepicker')) {
        $('input[name="value_from_end_date"]').data('daterangepicker').remove();
    }

    // Destroy Pikaday instances if any
    if (checkInPicker) {
        checkInPicker.destroy();
        checkInPicker = null;
    }
    if (checkOutPicker) {
        checkOutPicker.destroy();
        checkOutPicker = null;
    }

    // Remove any existing event handlers
    $('input[name="value_from_end_date"]').off('click');
    $('input[name="value_from_start_date"]').off('click change');

    if (isMobile) {
        initializeMobileDatePickers();
    } else {
        initializeDesktopDatePicker();
    }
}

function initializeDesktopDatePicker() {
    // Ensure inputs are text type for desktop
    $('input[name="value_from_start_date"]').attr('type', 'text');
    $('input[name="value_from_end_date"]').attr('type', 'text');
    
    // Remove any native date attributes
    $('input[name="value_from_start_date"]').removeAttr('min max');
    $('input[name="value_from_end_date"]').removeAttr('min max');

    var options = {
        autoUpdateInput: false,
        autoApply: true,
        locale: {
            format: dateFormat,
            separator: separator,
            applyLabel: '確認',
            cancelLabel: '取消'
        },
        minDate: moment().add(1, 'days'),
        maxDate: moment().add(359, 'days'),
        opens: "right"
    };

    // Initialize on both inputs but only use one instance
    var datePickerInstance = $('input[name="value_from_start_date"]').daterangepicker(options);
    
    // Make checkout input use the same picker
    $('input[name="value_from_end_date"]').on('click', function() {
        updatePickerWithCurrentDates();
        $('input[name="value_from_start_date"]').click();
    });

    $('input[name="value_from_start_date"]').on('click', function() {
        updatePickerWithCurrentDates();
    });

    datePickerInstance.on('apply.daterangepicker', function(ev, picker) {
        $('input[name="value_from_start_date"]').val(picker.startDate.format(dateFormat));
        $('input[name="value_from_end_date"]').val(picker.endDate.format(dateFormat));
    });
}

function initializeMobileDatePickers() {
    // Ensure inputs are text type
    $('input[name="value_from_start_date"]').attr('type', 'text');
    $('input[name="value_from_end_date"]').attr('type', 'text');
    
    // Remove any native date attributes
    $('input[name="value_from_start_date"]').removeAttr('min max');
    $('input[name="value_from_end_date"]').removeAttr('min max');

    // Pikaday options for mobile
    var pikadayOptions = {
        format: 'DD/MM/YYYY',
        minDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        maxDate: new Date(Date.now() + 359 * 24 * 60 * 60 * 1000), // 359 days from now
        showDaysInNextAndPreviousMonths: true,
        enableSelectionDaysInNextAndPreviousMonths: true,
        firstDay: 1, // Monday
        numberOfMonths: 1,
        theme: 'mobile-pikaday-theme'
    };

    // Check-in date picker
    checkInPicker = new Pikaday({
        ...pikadayOptions,
        field: document.querySelector('input[name="value_from_start_date"]'),
        onSelect: function(date) {
            // Update checkout min date to be after check-in
            var nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            if (checkOutPicker) {
                checkOutPicker.setMinDate(nextDay);
            }
            
            // Auto-set checkout if empty or invalid
            var checkoutDate = $('input[name="value_from_end_date"]').val();
            if (!checkoutDate) {
                checkOutPicker.setDate(nextDay);
            } else {
                var checkoutDateObj = parseDate(checkoutDate);
                if (checkoutDateObj && checkoutDateObj <= date) {
                    checkOutPicker.setDate(nextDay);
                }
            }
        }
    });

    // Check-out date picker
    checkOutPicker = new Pikaday({
        ...pikadayOptions,
        field: document.querySelector('input[name="value_from_end_date"]'),
        onSelect: function(date) {
            // Update checkin max date to be before check-out
            var prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            
            if (checkInPicker) {
                checkInPicker.setMaxDate(prevDay);
            }
            
            // Auto-set checkin if empty or invalid
            var checkinDate = $('input[name="value_from_start_date"]').val();
            if (!checkinDate) {
                checkInPicker.setDate(prevDay);
            } else {
                var checkinDateObj = parseDate(checkinDate);
                if (checkinDateObj && checkinDateObj >= date) {
                    checkInPicker.setDate(prevDay);
                }
            }
        }
    });

    // Convert existing dates if needed
    var currentStartDate = $('input[name="value_from_start_date"]').val();
    var currentEndDate = $('input[name="value_from_end_date"]').val();
    
    if (currentStartDate) {
        var startDateObj = parseDate(currentStartDate);
        if (startDateObj) {
            checkInPicker.setDate(startDateObj);
        }
    }
    
    if (currentEndDate) {
        var endDateObj = parseDate(currentEndDate);
        if (endDateObj) {
            checkOutPicker.setDate(endDateObj);
        }
    }
}

// Helper function to parse DD/MM/YYYY format
function parseDate(dateString) {
    if (!dateString) return null;
    
    var parts = dateString.split('/');
    if (parts.length === 3) {
        var day = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1; // Months are 0-indexed
        var year = parseInt(parts[2], 10);
        
        if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
            return new Date(year, month, day);
        }
    }
    return null;
}

function updatePickerWithCurrentDates() {
    if (isMobile) return;
    
    var startDateVal = $('input[name="value_from_start_date"]').val();
    var endDateVal = $('input[name="value_from_end_date"]').val();
    
    if (startDateVal && endDateVal) {
        var startDate = moment(startDateVal, dateFormat);
        var endDate = moment(endDateVal, dateFormat);
        
        if (startDate.isValid() && endDate.isValid()) {
            var picker = $('input[name="value_from_start_date"]').data('daterangepicker');
            if (picker) {
                picker.setStartDate(startDate);
                picker.setEndDate(endDate);
            }
        }
    }
}

// Initialize on page load
$(document).ready(function() {
    initializeDatePickers();
});

// Re-initialize on window resize with debounce
var resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        var newIsMobile = $(window).width() <= 575;
        if (newIsMobile !== isMobile) {
            isMobile = newIsMobile;
            initializeDatePickers();
        }
    }, 250);
});