
var arrDatabase = false;

var btjs = {
    sAccesskey : false,
    arrTickets : null,
    sServiceUrl : 'https://billets.io/ajax/api/',
    init : function init() {
        try {
            //if(!this.checkup()) { $('body').html(this.showNotSupported());}
            if(!this.getAccessTocken()) { $('#body').html(this.showNoAccessTocken()); }
            // this.arrTickets = jQuery.parseJSON(window.localStorage.getItem('terminal'));
            $.ajax({
                url: this.sServiceUrl+'getConfig/'+this.sAccesskey,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    btjs.showSceneSection(res);
                }
            });
        } catch(e) {
            alert(e);
        }
    },
    showSceneSection : function showSceneSection(arrData) {
        try {
            if(arrData.length > 0) {
            // BYPASS! Todo : Gérer les section de scène.
                if(arrData["error"]) {
                    $('#body').html("<center><p><img style='margin-top: 20px;' src='https://billets.io/images/billets.tk.png' /></p><br /><p class='text-danger'>Code d'acces invalide</p><br /><p><a href='http://support.billets.io/kb/faq.php?cid=4' class='btn btn-default' target='_blank'>Support</a></p></center>");
                }else {
                    this.populateAllData();
                }
            } else {
                if(arrData["error"]) {
                    $('#body').html("<center><p><img style='margin-top: 20px;' src='https://billets.io/images/billets.tk.png' /></p><br /><p class='text-danger'>Code d'acces invalide</p><br /><p><a href='http://support.billets.io/kb/faq.php?cid=4' class='btn btn-default' target='_blank'>Support</a></p></center>");
                }else {
                    this.populateAllData();
                }
            }
        } catch(e) {
            alert(e);
        }
    },
    showValidationEngine: function showValidationEngine() {
        try {
            var iTotal = 0;
            for(item in this.arrTickets) { iTotal ++; }
            $('#body').html('<div class="container-fluid"><div class="row"><nav class="navbar navbar-default navbar-static-top" style="margin-bottom:0px;"><div class="container-fluid"><div class="navbar-header"><div class="navbar-brand"><img alt="Brand" style="height:20px; margin-right:5px;" src="https://billets.io/images/billets.tk-rev.png"></div> <p class="navbar-text"><span class="text-success">Chargé (<strong>'+iTotal+' billets</strong>)</span></p>  </div>  </div></nav></div></div>');
            load();
        } catch(e) {
            alert(e);
        }
    },
    populateAllData: function populateAllData() {
        try {
        // show loading

            $('#body').html("<center><p><img style='margin-top: 20px;' src='https://billets.io/images/billets.tk.png' /></p><br /><p>Chargement en cours...</p><br /><img src='https://billets.io/images/24-1.gif'></center>");
            $.ajax({
                url: this.sServiceUrl+'getTicket/'+this.sAccesskey,
                type: 'GET',
                dataType: 'json',
                success: function(res) {
                    btjs.arrTickets = res;
                    arrDatabase = res;
                    btjs.showValidationEngine();
                }
            });
        } catch(e) {
            alert(e);
        }
    },
    getAccessTocken : function getAccessTocken(){
        try {
            this.sAccesskey = window.location.href.split('?')[1].split('=')[1];
            if(this.sAccesskey == '') {
                return false;
            } else {
                return true;
            }
        } catch(e) {
            return false;
        }
    },
    showNoAccessTocken : function showNoAccessTocken() {
        return '...';
    },
    showNotSupported: function showNotSupported() {
        return '<h1>Non supporté :(</h1><p>Le navigateur que vous utilisez en ce moment ne peut pas supporter la valideuse. Assurez-vous d\'utilisez un navigateur moderne supportant le "LocalStorage" et le "WebQr".</p>'
    },
    checkup: function checkup() {
        var testKey = 'test';
        try {
            window.localStorage.setItem(testKey, '1');
            window.localStorage.removeItem(testKey);
            return true;
        } catch(e) {
            return false;
        }
    }
}
btjs.init();
