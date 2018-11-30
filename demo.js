$(function () {

    $(".btnDelete").on("click", function () {
        var _row = $(this).closest('tr');
        var bookingId = _row.find(".bookingId").text();
        _row.find('i').removeClass('fas fa-trash-alt').addClass('fas fa-sync-alt fa-spin');
        deleteBooking(bookingId, _row);
    });

    $("#btnSend").on("click", function () {

        $("#messErrorReturn").hide();

        $("#inputBookingId").closest("div").children(".messError").hide();
        $(".booking-date .messError").hide();
        $(".booking-fromDate .messError").hide();
        $(".booking-toDate .messError").hide();

        // $("#inputBookingDate").closest("div").children(".messError").hide();
        // $("#inputFromDate").closest("div").children(".messError").hide();
        // $("#inputToDate").closest("div").children(".messError").hide();

        var bookingId = $("#inputBookingId").val();
        var roomId = $("#inputRoomId").val();
        var customerId = $("#inputCustomerId").val();
        var bookingDate = $("#inputBookingDate").val();
        bookingDate = bookingDate.split("-").reverse().join("-");
        var fromDate = $("#inputFromDate").val();
        fromDate = fromDate.split("-").reverse().join("-");
        var toDate = $("#inputToDate").val();
        toDate = toDate.split("-").reverse().join("-");
        var bookingStatus = $("#checkActive:checked")[0] ? 1 : 2;

        if (bookingId === "")
            $("#inputBookingId").closest("div").children(".messError").show();
        if (bookingDate === "")
            $(".booking-date .messError").show();
            //$("#inputBookingDate").closest("div").closest("div").children(".messError").show();
        if (fromDate === "")
            $(".booking-fromDate .messError").show();
            //$("#inputFromDate").closest("div").closest("div").children(".messError").show();
        if (toDate === "")
            $(".booking-toDate .messError").show();
            //$("#inputToDate").closest("div").closest("div").children(".messError").show();

        if (!(bookingDate && fromDate && toDate && roomId && bookingId && customerId))
            return;

        $(this).prop("disabled", true);
        $(this).children('i').addClass('fas fa-sync-alt fa-spin').css("margin-right", "8px");

        var dataSend = {
            bookingID: bookingId,
            bookingDate: bookingDate,
            fromDate: fromDate,
            toDate: toDate,
            bookingStatus: bookingStatus,
            customer: {
                customerID: customerId
            },
            room: {
                roomID: roomId
            }
        };
        var elementTable = $('#tableValues tr:last');
        var typeAction = $("#btnSend").attr("name");
        if (typeAction === "Edit")
            elementTable = $("td.bookingId").filter(function() { return ($(this).text() === bookingId) }).closest('tr');
        saveBooking(dataSend, $("#btnSend").attr("name"), elementTable);
    });

    $("#btnClose").on("click", function () {
        console.log('click delete');

    });

    $('#modalBooking').on('show.bs.modal', function (event) {

        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // var child = $("#btnSend").children().clone();
        // $("#btnSend").append(child).text(recipient);
        $("#btnSend").attr('name', recipient);
        $("#btnSend").get(0).lastChild.nodeValue = recipient;
        $("#modalBooking .modal-title").text(recipient + ' Booking');

        if (recipient === 'Add') {
            $("#inputBookingId").val("#");

            var roomId = $("#inputRoomId option").first().val();
            var customerId = $("#inputCustomerId option").first().val();
            $("a[ng-click='showInfoRoom']").attr("roomId",roomId);
            $("a[ng-click='showInfoCustomer']").attr("customerId",customerId);

           
            return;
        }
        
        var _row = button.parents("tr");

        var bookingId = _row.find(".bookingId").text();
        var roomId = _row.find(".roomId > a").attr("roomId");
        var customerId = _row.find(".customerId > a").attr("customerId");
        var bookingDate = _row.find(".bookingDate").text();
        var fromDate = _row.find(".fromDate").text();
        var toDate = _row.find(".toDate").text();
        var isActive = +_row.find('.isActive span').text() == 1 ? true : false;

        // console.log(_invoiceAmt, _chequeAmt);

        $(this).find("#inputBookingId").val(bookingId);
        $(this).find("#inputRoomId").val(roomId);
        $(this).find("#inputCustomerid").val(customerId);
        $(this).find("#inputBookingDate").val(bookingDate);
        $(this).find("#inputFromDate").val(fromDate);
        $(this).find("#inputToDate").val(toDate);
        $("#inputBookingId").prop("disabled", true);
        $("#modalBooking a[ng-click='showInfoRoom']").attr("roomId", roomId);
        $("#modalBooking a[ng-click='showInfoCustomer']").attr("customerId", customerId);

        if (isActive)
            $("#checkActive").prop('checked', true);
        else
            $("#checkDeactive").prop('checked', true);

    });

    $("#modalBooking").on("hidden.bs.modal", function () {
        $(this).find("#inputBookingId").val("");
        $(this).find("#inputBookingDate").val('');
        $(this).find("#inputFromDate").val('');
        $(this).find("#inputToDate").val('');

        $("#inputBookingDate").closest("div").children(".messError").hide();
        $("#inputFromDate").closest("div").children(".messError").hide();
        $("#inputToDate").closest("div").children(".messError").hide();
        $(this).prop("disabled", false);
        $("#inputBookingId").prop("disabled", false);


    });

    $("#modalDeleteNotify").on("hidden.bs.modal", function () {});

    $('.datetimepicker').datetimepicker({
        format: 'DD-MM-YYYY',
    });

    $('.datetimepicker-addon').on('click', function () {
        $(this).prev('input.datetimepicker').data('DateTimePicker').toggle();
    });

    $("#modalShowInfo").on("hidden.bs.modal", function () {
        $("#bodyInfo").empty()
    });

    function showInfoCustomer() {
        var customerId = $(this).attr('customerId');
        var xhr = $.ajax({
            url: 'customer?id=' + customerId,
            type: 'GET',
        }).done(data => {
            $("#modalShowInfo").modal().show();
            if (data.status === 'ERROR') {
                $("#modalShowInfo #messReturn").show();
                $("#modalShowInfo #bodyInfo").hide();
                $("#modalShowInfo .modal-title").text("ERROR");

                $("#modalShowInfo #messReturn").text(data.message);
            } else {
                $("#modalShowInfo .modal-title").text("Customer Infomation");
                $("#modalShowInfo #messReturn").hide();
                $("#modalShowInfo #bodyInfo").show();
                var htmlRt = `
                    <tr>
                        <th>Customer Id</th>
                        <td>${data.value.customerID}</td>
                    </tr>
                    <tr>
                        <th>FullName</th>
                        <td>${data.value.fullName}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>${data.value.address}</td>
                    </tr>
                    <tr>
                        <th>Day Of Birth</th>
                        <td>${data.value.dayOfBirth.split("-").reverse().join("-")}</td>
                    </tr>
                    <tr>
                        <th>Phone Number</th>
                        <td>${data.value.phoneNumber}</td>
                    </tr>
                `
                $("#modalShowInfo #bodyInfo").append(htmlRt);
            }
        }).fail(data => {
            $("#modalShowInfo .modal-title").text("ERROR");

            $("#modalShowInfo").modal().show();
            $("#modalShowInfo #messReturn").show();
            $("#modalShowInfo #bodyInfo").hide();
            $("#modalShowInfo #messReturn").text("Error undefined");
        });
    }

    function showInfoRoom() {
        var roomType = ["", "Single", "Double", "Three", "Group"];
        var roomId = $(this).attr('roomId');
        var xhr = $.ajax({
            url: 'room?id=' + roomId,
            type: 'GET',
        }).done(data => {
            $("#modalShowInfo").modal().show();
            if (data.status === 'ERROR') {
                $("#modalShowInfo .modal-title").text("ERROR");
                $("#modalShowInfo #messReturn").show();
                $("#modalShowInfo #messReturn").text(data.message);

                $("#modalShowInfo #bodyInfo").hide();

            } else {
                $("#modalShowInfo .modal-title").text("Room Infomation");

                $("#modalShowInfo #messReturn").hide();
                $("#modalShowInfo #bodyInfo").show();
                var htmlActive = '';
                if (data.value.isActive) {
                    htmlActive = `
                        <center class="fas fa-check"></center>
                    `;
                } else {
                    htmlActive = `<center class="fas fa-times"></center>`
                }

                var htmlRt = `
                    <tr>
                        <th>Room Id</th>
                        <td>${data.value.roomID}</td>
                    </tr>
                    <tr>
                        <th>Room Name</th>
                        <td>${data.value.roomName}</td>
                    </tr>
                    <tr>
                        <th>Room Type</th>
                        <td>${roomType[data.value.roomType]}</td>
                    </tr>
                    <tr>
                        <th>Active</th>
                        <td>${htmlActive}</td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td>${data.value.description}</td>
                    </tr>
                `
                $("#modalShowInfo #bodyInfo").append(htmlRt);
            }
        }).fail(data => {
            $("#modalShowInfo #modal-title").text("ERROR");
            $("#modalShowInfo").modal().show();
            $("#modalShowInfo #messReturn").text("Error undefined");

            $("#modalShowInfo #messReturn").show();
            //$("#modalShowInfo #bodyInfo").hide();
        });
    }
    $("a[ng-click='showInfoCustomer']").on("click", showInfoCustomer);

    $("a[ng-click='showInfoRoom']").on("click", showInfoRoom);

    $("#inputRoomId").change(function () {
        $("#modalBooking a[ng-click='showInfoRoom']").attr("roomId", $(this).val());
    });
    $("#inputCustomerId").change(function () {
        $("#modalBooking a[ng-click='showInfoCustomer']").attr("customerId", $(this).val());
    });


});


let _statusError = "ERROR";
let _statusSuccess = "OK";
let _urlBooking = 'booking'
let _messSuccess = 'Successful'

function showInfoCustomer() {
    var customerId = $(this).attr('customerId');
    var xhr = $.ajax({
        url: 'customer?id=' + customerId,
        type: 'GET',
    }).done(data => {
        $("#modalShowInfo").modal().show();
        if (data.status === 'ERROR') {
            $("#modalShowInfo #messReturn").show();
            $("#modalShowInfo #bodyInfo").hide();

            $("#modalShowInfo #messReturn").text(data.message);
        } else {
            $("#modalShowInfo #messReturn").hide();
            $("#modalShowInfo #bodyInfo").show();
            var htmlRt = `
                <tr>
                    <th>Customer Id</th>
                    <td>${data.value.customerID}</td>
                </tr>
                <tr>
                    <th>FullName</th>
                    <td>${data.value.fullName}</td>
                </tr>
                <tr>
                    <th>Address</th>
                    <td>${data.value.address}</td>
                </tr>
                <tr>
                    <th>Day Of Birth</th>
                    <td>${data.value.dayOfBirth.split("-").reverse().join("-")}</td>
                </tr>
                <tr>
                    <th>Phone Number</th>
                    <td>${data.value.phoneNumber}</td>
                </tr>
            `
            $("#modalShowCustomer #bodyCustomerInfo").append(htmlRt);
        }
    }).fail(data => {
        $("#modalShowInfo").modal().show();
        $("#modalShowInfo #messReturn").show();
        $("#modalShowInfo #bodyInfo").hide();
        $("#modalShowInfo #messReturn").text("Error undefined");
    });
}

function showInfoRoom() {
    var roomType = ["Single", "Double", "Three", "Group"];
    var roomId = $(this).attr('roomId');
    var xhr = $.ajax({
        url: 'rooms?id=' + roomId,
        type: 'GET',
    }).done(data => {
        $("#modalShowInfo").modal().show();
        if (data.status === 'ERROR') {
            $("#modalShowInfo #messReturn").show();
            $("#modalShowInfo #bodyInfo").hide();

            $("#modalShowInfo #messReturn").text(data.message);
        } else {
            $("#modalShowInfo #messReturn").hide();
            $("#modalShowInfo #bodyInfo").show();
            var htmlActive = '';
            if (data.isActive) {
                htmlActive = `
                    <center class="fas fa-check"></center>
                `;
            } else {
                htmlActive = `<center class="fas fa-times"></center>`
            }

            var htmlRt = `
                <tr>
                    <th>Room Id</th>
                    <td>${data.value.roomID}</td>
                </tr>
                <tr>
                    <th>Room Name</th>
                    <td>${data.value.roomName}</td>
                </tr>
                <tr>
                    <th>Room Type</th>
                    <td>${roomType[data.value.roomType]}</td>
                </tr>
                <tr>
                    <th>Active</th>
                    <td>${htmlActive}</td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>${data.value.description}</td>
                </tr>
            `
            $("#modalShowCustomer #bodyCustomerInfo").append(htmlRt);
        }
    }).fail(data => {
        $("#modalShowInfo").modal().show();
        $("#modalShowInfo #messReturn").show();
        $("#modalShowInfo #bodyInfo").hide();
        $("#modalShowInfo #messReturn").text("Error undefined");
    });
}

function saveBooking(data, method, element) {
    var typeRq = 'POST';
    if (method === 'Edit') {
        typeRq = 'PUT';
    }
    var jsonData = JSON.stringify(data);
    var http = new XMLHttpRequest();
    http.open(typeRq, _urlBooking, true);
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            resp = http.responseText;
            var resultJson = JSON.parse(http.responseText);
            if (resultJson.status === _statusError) {
                $("#messReturn").text(resultJson.message).show();
            } else {
                data = resultJson.value;
                $("#messReturnDelete").text(method + ' ' + _messSuccess).removeClass('text-danger').addClass('text-success');
                var isActive = {
                    code: 2,
                    icon: "fas fa-times"
                };
                if (data.bookingStatus === 1) {
                    isActive = {
                        code: 1,
                        icon: "fas fa-check"
                    }
                };
                if (method !== 'Edit') {
                    var isEmpty = $("#tableValues tbody").text().includes("No matching records found");
                    if(isEmpty){
                        $("#tableValues>tbody>tr").remove();
                    }
                    var row = `
                    <tr>
                        <td class="pt-3-half bookingId">${data.bookingID}</td>
                        <td class="pt-3-half customerId">
                            <a href="#" ng-click="showWarehouseInfo()">${data.customer.customerID} - ${data.customer.fullName}</a>
                        </td>
                        <td class="pt-3-half roomId">
                            <a href="#" ng-click="showWarehouseInfo()">${data.room.roomID} - ${data.room.roomName}</a>
                        </td>
                        <td class="pt-3-half bookingDate">${data.bookingDate.split("-").reverse().join("-")}</td>
                        <td class="pt-3-half fromDate">${data.fromDate.split("-").reverse().join("-")}</td>
                        <td class="pt-3-half toDate">${data.toDate.split("-").reverse().join("-")}</td>
                        <td class="pt-3-half isActive">
                            <span style="display:none">${isActive.code}</span>
                            <center class="${isActive.icon}"></center>
                        </td>
                        <td>
                            <span class="table-remove">
                                <button type="button" data-toggle="modal" data-target="#modalBooking" data-whatever="edit" class="btn btn-warning btn-rounded btn-sm my-0 fas fa-edit"></button>
                                <button type="button" class="btn btn-danger btn-rounded btn-sm my-0 fas fa-trash-alt"></button>
                            </span>
                        </td>
                    </tr>
                `;
                    $('#modalDeleteNotify').modal('show');
                    $("#modalBooking").hide();
                    var rowElementAdd = $(row);
                    rowElementAdd.hide();

                    if(isEmpty)
                        $("#tableValues>tbody").append(rowElementAdd);
                    else
                        element.after(rowElementAdd);

                    rowElementAdd.fadeTo("slow", 1);
                    $(".btnDelete").on("click", function () {
                        var _row = $(this).closest('tr');
                        var bookingId = _row.find(".bookingId").text();
                        _row.find('i').removeClass('fas fa-trash-alt').addClass('fas fa-sync-alt fa-spin');
                        deleteBooking(bookingId, _row);
                    });
                    $("a[ng-click='showInfoCustomer']").on("click", showInfoCustomer);
                    $("a[ng-click='showInfoRoom']").on("click", showInfoRoom);
                } else {

                    $('#modalDeleteNotify').modal('show');
                    $("#modalCustomer").hide();
                    element.find('.bookingId').text(data.bookingID);
                    element.find('.customerId a').text(data.customer.customerID);
                    element.find('.roomId a').text(data.room.roomID);
                    element.find('.bookingDate').text(data.bookingDate.split("-").reverse().join("-"));
                    element.find('.fromDate').text(data.fromDate.split("-").reverse().join("-"));
                    element.find('.toDate').text(data.toDate.split("-").reverse().join("-"));
                    element.find('.isActive center').removeClass('fas fa-check').removeClass('fas fa-times').addClass(isActive.icon);
                    element.find('.isActive span').text(isActive.code);

                    element.find('.phoneNumber').text(data.phoneNumber);
                    $("#modalBooking").hide();

                }
            }

        } else {
            $('#messReturnDelete').text("Error undefined").removeClass('text-success').addClass('text-danger');
            $('#modalDeleteNotify').modal('show');
        }

    }
    http.onloadend = function () {
        $("#btnSend").prop("disabled", false);
        $("#btnSend").children('i').removeClass('fas fa-sync-alt fa-spin').css("margin-right", "");
    }
    http.send(jsonData);
    $("#btnSend").children('i').addClass('fas fa-sync-alt fa-spin');
}

function deleteBooking(bookingId, element) {
    var http = new XMLHttpRequest();
    var urlDelete = `${_urlBooking}?id=${bookingId}`;
    http.open('DELETE', urlDelete, true);
    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/json');
    http.onreadystatechange = function () { //Call a function when the state changes.
        if (http.readyState == 4 && http.status == 200) {
            var resultJson = JSON.parse(http.responseText);
            if (resultJson.status === _statusError) {
                $('#messReturnDelete').text(resultJson.message);
                $('#modalDeleteNotify').modal('show');
            } else {
                element.fadeTo(400, 0, function () {
                    $(this).remove();
                    if(!$("#tableValues>tbody>tr")[0]){
                        var row = `<tr class="no-records-found"><td colspan="8">No matching records found</td></tr>`;
                        $("#tableValues>tbody").append(row)
                    }
                });
            }

        } else if (http.readyState == 4 && http.status != 200) {
            console.log(http.responseText);
            $('#messReturnDelete').text("Error undefined");
            $('#modalDeleteNotify').modal('show');
            element.find('i').removeClass('fas fa-sync-alt fa-spin').addClass('fas fa-trash-alt');
        }

    }
    http.send();
}