$(document).ready(function () {

  // Load header, footer, and mobile menu
  $("#header").load("includes/header.html", function () {
    // Run sticky header (after header loaded)
    $("header .top-menu").sticky({ topSpacing: 0 });

    // After header & mobile menu are loaded, initialize menu
    initializeMenu();
  });

  $("#mobile-menu").load("includes/mobilemenu.html", function () {
    // Initialize menu once mobile menu is loaded too
    initializeMenu();
  });

  $("#footer").load("includes/footer.html", function () {
    // Auto year update inside footer
    $(".year").text(new Date().getFullYear());
  });

  // Function to initialize menu functionality
  function initializeMenu() {
    // Run only if both header and mobile menu exist
    if ($(".m-menu").length && $(".mobile-menu").length) {

      // Mobile Menu Toggle
      $(".m-menu a").off("click").on("click", function (e) {
        e.preventDefault(); // prevent default link action
        $(".m-menu").toggleClass("open");
        $(".mob-nav").toggleClass("slow");
        $("body").toggleClass("over");
    });
    

      // Set Active Link
      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      $(".menu a, .mobile-menu a").each(function () {
        const linkPage = $(this).attr("href").split("/").pop();
        if (linkPage === currentPage) {
          $(this).addClass("active");
        }
      });
    }
  }

});




// // Gallery light case
// $(document).ready(function($) {
//   $('a[data-rel^=lightcase]').lightcase({
//       maxWidth: 1200,
//       maxHeight: 800,
//       transition: 'fade',
//       showTitle: true,
//       showCaption: true,
//       slideshow: true,
//       swipe: true,
//       showSequenceInfo: true
//   });
// });



// Input Box Placeholder
function fnremove(arg, val) {
	if (arg.value == '') { arg.value = val }
}
function fnshow(arg, val) {
	if (arg.value == val) { arg.value = '' }
}



// booking page
$(document).ready(function () {

    //*****************************Guest list adding and removing*****************************
    const $dropdownBtn = $(".gdropdown-btn");
    const $dropdownMenu = $(".gdropdown-menu");
    const $summary = $("#guest-summary");
  
    const $inputs = {
      adults: $("#adults-input"),
      children: $("#children-input"),
      infants: $("#infants-input"),
    };
  
    const $decreaseButtons = {
      adults: $('.decrease[data-type="adults"]'),
      children: $('.decrease[data-type="children"]'),
      infants: $('.decrease[data-type="infants"]'),
    };
  
    // Toggle dropdown
    $dropdownBtn.on("click", function (e) {
      e.stopPropagation();
      $dropdownMenu.toggleClass("active");
    });
  
    // Close dropdown when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".gdropdown-menu, .gdropdown-btn").length) {
        $dropdownMenu.removeClass("active");
      }
    });
  
    // Increase / Decrease buttons
    $(".increase, .decrease").on("click", function () {
      const type = $(this).data("type");
      let value = parseInt($inputs[type].val());
  
      if ($(this).hasClass("increase")) {
        value++;
      } else if ($(this).hasClass("decrease")) {
        if (type === "adults" && value === 1) {
          return; // prevent reducing adults below 1
        }
        if (value > 0) value--;
      }
  
      $inputs[type].val(value);
      updateSummary();
      updateButtons();
    });
  
    function updateSummary() {
      const adults = parseInt($inputs.adults.val());
      const children = parseInt($inputs.children.val());
      const infants = parseInt($inputs.infants.val());
  
      const totalGuests = adults + children;
  
      let text = "";
      if (totalGuests > 0) {
        text += totalGuests + " guest" + (totalGuests > 1 ? "s" : "");
      }
      if (infants > 0) {
        text += (text ? ", " : "") + infants + " infant" + (infants > 1 ? "s" : "");
      }
  
      $summary.text(text || "0 guests");
    }
  
    function updateButtons() {
      // Adults cannot go below 1
      if (parseInt($inputs.adults.val()) <= 1) {
        disableButton($decreaseButtons.adults);
      } else {
        enableButton($decreaseButtons.adults);
      }
  
      // Children cannot go below 0
      if (parseInt($inputs.children.val()) <= 0) {
        disableButton($decreaseButtons.children);
      } else {
        enableButton($decreaseButtons.children);
      }
  
      // Infants cannot go below 0
      if (parseInt($inputs.infants.val()) <= 0) {
        disableButton($decreaseButtons.infants);
      } else {
        enableButton($decreaseButtons.infants);
      }
    }
  
    function disableButton($btn) {
      $btn.prop("disabled", true).css({ opacity: "0.5", cursor: "not-allowed" });
    }
  
    function enableButton($btn) {
      $btn.prop("disabled", false).css({ opacity: "1", cursor: "pointer" });
    }
  
    // Initial setup
    updateSummary();
    updateButtons();

    
    //***************************** booking form validation *****************************
    const $form = $("#fran-form");
    const $firstName = $("#firstName-input");
    const $lastName = $("#lastName-input");
    const $email = $("#email-input");
    const $phone = $("#phone-input");
    const $details = $("#details-input");

    $form.on("submit", function (e) {
        if (!validateInputs()) {
            e.preventDefault();
        }
    });

    function validateInputs() {
        const firstNameVal = $firstName.val().trim();
        const lastNameVal = $lastName.val().trim();
        const emailVal = $email.val().trim();
        const phoneVal = $phone.val().trim();
        const detailsVal = $details.val().trim();
        let success = true;

        // First Name
        if (firstNameVal === "") {
            success = false;
            setError($firstName, "Please enter your first name*");
        } else if (/\d/.test(firstNameVal)) {
            success = false;
            setError($firstName, "First name cannot contain numbers*");
        } else {
            setSuccess($firstName);
        }

        // Last Name
        if (lastNameVal === "") {
            success = false;
            setError($lastName, "Please enter your last name*");
        } else if (/\d/.test(lastNameVal)) {
            success = false;
            setError($lastName, "Last name cannot contain numbers*");
        } else {
            setSuccess($lastName);
        }

        // Email
        if (emailVal === "") {
            success = false;
            setError($email, "Email is required*");
        } else if (!validateEmail(emailVal)) {
            success = false;
            setError($email, "Please enter a valid Email*");
        } else {
            setSuccess($email);
        }

        // Phone
        if (phoneVal === "") {
            success = false;
            setError($phone, "Please enter your phone number*");
        } else if (!/^[0-9]{7,15}$/.test(phoneVal)) {
            success = false;
            setError($phone, "Please enter a valid phone number*");
        } else {
            setSuccess($phone);
        }

        // Details (required — make optional if needed)
        if (detailsVal === "") {
            success = false;
            setError($details, "Please provide details*");
        } else {
            setSuccess($details);
        }

        return success;
    }

    function setError($element, message) {
        const $inputGroup = $element.parent();
        const $errorElement = $inputGroup.find(".error-msg");

        $errorElement.text(message);
        $inputGroup.addClass("error").removeClass("success");
    }

    function setSuccess($element) {
        const $inputGroup = $element.parent();
        const $errorElement = $inputGroup.find(".error-msg");

        $errorElement.text("");
        $inputGroup.addClass("success").removeClass("error");
    }

    function validateEmail(email) {
        return String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }


    // ***************************** Contact form validation *****************************
    // Contact Form Validation
    const $contactForm = $("#contact-form");
    const $contactName = $("#contact-name");
    const $contactEmail = $("#contact-email");
    const $contactMessage = $("#contact-message");

    $contactForm.on("submit", function(e) {
        if (!validateContactForm()) {
            e.preventDefault();
        }
    });

    function validateContactForm() {
        let success = true;
        const nameVal = $contactName.val().trim();
        const emailVal = $contactEmail.val().trim();
        const messageVal = $contactMessage.val().trim();

        // Name
        if (nameVal === "") {
            success = false;
            setError($contactName, "Please enter your name*");
        } else if (/\d/.test(nameVal)) {
            success = false;
            setError($contactName, "Name cannot contain numbers*");
        } else {
            setSuccess($contactName);
        }

        // Email
        if (emailVal === "") {
            success = false;
            setError($contactEmail, "Email is required*");
        } else if (!validateEmail(emailVal)) {
            success = false;
            setError($contactEmail, "Please enter a valid Email*");
        } else {
            setSuccess($contactEmail);
        }

        // Message (optional, remove if required)
        if (messageVal === "") {
            success = false;
            setError($contactMessage, "Please enter a message*");
        } else {
            setSuccess($contactMessage);
        }

        return success;
    }

    // Reuse the same helper functions from your previous code
    function setError($element, message) {
        const $inputGroup = $element.parent();
        const $errorElement = $inputGroup.find(".error-msg");
        $errorElement.text(message);
        $inputGroup.addClass("error").removeClass("success");
    }

    function setSuccess($element) {
        const $inputGroup = $element.parent();
        const $errorElement = $inputGroup.find(".error-msg");
        $errorElement.text("");
        $inputGroup.addClass("success").removeClass("error");
    }

    function validateEmail(email) {
        return String(email).toLowerCase().match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

});

// Gallery light case
$(document).ready(function($) {
  $('a[data-rel^=lightcase]').lightcase({
      maxWidth: 1200,
      maxHeight: 800,
      transition: 'fade',
      showTitle: true,
      showCaption: true,
      slideshow: true,
      swipe: true,
      showSequenceInfo: true
  });
});