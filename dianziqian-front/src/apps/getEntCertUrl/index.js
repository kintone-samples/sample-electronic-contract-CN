import {Spinner, NotifyPopup} from '@kintone/kintone-ui-component/esm/js';
import {config} from '../libs/config.js';

((PLUGIN_ID) => {
  kintone.events.on('app.record.detail.show', async (event) => {
    const body = document.getElementsByTagName('BODY')[0];
    const spinner = new Spinner();
    body.appendChild(spinner.render());
    const kintoneSpaceElement = kintone.app.record.getHeaderMenuSpaceElement();
    const jQuerybutton = jQuery(`<div style="margin:10px 20px 0px 20px;">
        <button type="button" class="btn btn-primary" id="getEntCertUrl">邀请注册认证</button>
        </div>`);

    kintoneSpaceElement.appendChild(jQuerybutton.get(0));
    const headers = {
      'Content-Type': 'application/json'
    };

    const handler = (operation, success) => {
      const options = [PLUGIN_ID, config.apiPerUrl + operation, 'POST', headers, {recordId: kintone.app.record.getId()}];
      spinner.show();
      let notifyPopupInfo = {};
      kintone.plugin.app.proxy(...options).then(res => {
        const resp = JSON.parse(res[0]);
        if (resp.code !== 200) {
          notifyPopupInfo = {
            text: resp.data,
            type: 'error'
          };
        } else {
          notifyPopupInfo = {
            text: success,
            type: 'success'
          };
        }
      }).catch((error) => {
        notifyPopupInfo = {
          text: error,
          type: 'error'
        };
      }).finally(() => {
        spinner.hide();
        const notifyPopup = new NotifyPopup(notifyPopupInfo);
        body.appendChild(notifyPopup.render());
        const reload = ()=>{
          window.location.reload();
        };
        setTimeout(reload, 1000);
      });
    };

    const getEntCertUrl = () => {
      handler('getEntCertUrl', '已经向电子牵发送认证请求');
    };
    kintoneSpaceElement.appendChild(jQuerybutton.get(0));
    jQuery('#getEntCertUrl').click(getEntCertUrl);
  });
})(kintone.$PLUGIN_ID);