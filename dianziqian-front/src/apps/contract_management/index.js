import {Spinner, NotifyPopup} from '@kintone/kintone-ui-component/esm/js';
import {config} from '../libs/config.js';

((PLUGIN_ID) => {
  const operationDisplay = status => {
    const uploadButton = `<button type="button" class="btn btn-primary" id="upload">上传</button>`;
    const signButton = `<button type="button" class="btn btn-primary" id="sign">签署</button>`;
    const inactiveButton = `<button type="button" class="btn btn-primary" id="inactive">撤销</button>`;
    const archiveButton = `<button type="button" class="btn btn-primary" id="archive">归档</button>`;
    const uploadDisabledButton = `<button type="button" class="btn btn-secondary" id="upload" disabled>上传</button>`;
    const signDisabledButton = `<button type="button" class="btn btn-secondary" id="sign" disabled>签署</button>`;
    const inactiveDisabledButton = `<button type="button" class="btn btn-secondary" id="inactive" disabled>撤销</button>`;
    const archiveDisabledButton = `<button type="button" class="btn btn-secondary" id="archive" disabled>归档</button>`;
    let buttons = '';
    switch (status) {
      case config.contractStatus.notUpload:
        buttons = `${uploadButton}
                ${signDisabledButton}
                ${inactiveDisabledButton}
                ${archiveDisabledButton}`;
        break;
      case config.contractStatus.uploaded:
        buttons = `${uploadButton}
                ${signButton}
                ${inactiveDisabledButton}
                ${archiveDisabledButton}`;
        break;
      case config.contractStatus.startSign:
        buttons = `${uploadDisabledButton}
                ${signButton}
                ${inactiveButton}
                ${archiveDisabledButton}`;
        break;
      case config.contractStatus.signing:
        buttons = `${uploadDisabledButton}
                ${signButton}
                ${inactiveDisabledButton}  
                ${archiveButton}`;
        break;
      case config.contractStatus.inactive:
        buttons = `${uploadButton}
                ${signDisabledButton}
                ${inactiveDisabledButton}
                ${archiveDisabledButton}`;
        break;
      case config.contractStatus.archive:
        buttons = `${uploadDisabledButton}
                ${signDisabledButton}
                ${inactiveDisabledButton}
                ${archiveDisabledButton}`;
        break;
      default:
        buttons = `${uploadDisabledButton}
                ${signDisabledButton}
                ${inactiveDisabledButton}
                ${archiveDisabledButton}`;
    }
    const operationsDom = jQuery(`<div style="margin:10px 20px 0px 20px;">${buttons}</div>`);
    return operationsDom;
  };
  kintone.events.on('app.record.detail.show', async (event) => {
    const body = document.getElementsByTagName('BODY')[0];
    const spinner = new Spinner();
    body.appendChild(spinner.render());
    const contractStatus = event.record.contractStatus.value;
    const kintoneSpaceElement = kintone.app.record.getHeaderMenuSpaceElement();
    const operationsDom = operationDisplay(contractStatus);
    kintoneSpaceElement.appendChild(operationsDom.get(0));
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

    const upload = () => {
      handler('sendcontract', '文件已上传');
    };

    const inactive = () => {
      handler('inactive', '文件已撤销');
    };


    const sign = async () => {
      handler('sign', '发起签署成功');
    };

    const archive = async () => {
      handler('archive', '发起归档成功');
    };

    jQuery('#upload').click(upload);
    jQuery('#sign').click(sign);
    jQuery('#archive').click(archive);
    jQuery('#inactive').click(inactive);
  });

  const commonHideEvents = ['app.record.create.show', 'app.record.index.edit.show', 'app.record.edit.show'];
  kintone.events.on(commonHideEvents, (event) => {
    kintone.app.record.setFieldShown('resultDesc', false);
    kintone.app.record.setFieldShown('transactionCode', false);
    kintone.app.record.setFieldShown('downloadUrl', false);
    kintone.app.record.setFieldShown('viewPdfUrl', false);
    kintone.app.record.setFieldShown('signUrl', false);
    kintone.app.record.setFieldShown('status', false);
    kintone.app.record.setFieldShown('contractCode', false);
    kintone.app.record.setFieldShown('messageSendResult', false);
    kintone.app.record.setFieldShown('contractStatus', false);

    return event;
  });


  const editEvents = ['app.record.create.show', 'app.record.edit.show'];
  kintone.events.on(editEvents, (event) => {
    const chooseField = 'type';
    const type = event.record[chooseField].value;
    if (type === '人事合同') {
      kintone.app.record.setFieldShown('companySearch', false);
      kintone.app.record.setFieldShown('companyOpenCode', false);
      kintone.app.record.setFieldShown('companyName', false);
      kintone.app.record.setFieldShown('entPersonOpenCode', false);
      kintone.app.record.setFieldShown('companyUserName', false);
    }
    if (type === '对外合同') {
      kintone.app.record.setFieldShown('personSearch', false);
      kintone.app.record.setFieldShown('personOpenCode', false);
      kintone.app.record.setFieldShown('username', false);
    }
    return event;
  });


  kintone.events.on('app.record.detail.show', (event) => {
    const chooseField = 'type';
    const type = event.record[chooseField].value;
    kintone.app.record.setFieldShown('personSearch', false);
    kintone.app.record.setFieldShown('companySearch', false);
    if (type === '对外合同') {
      kintone.app.record.setFieldShown('personOpenCode', false);
      kintone.app.record.setFieldShown('username', false);
    }
    return event;
  });

  const chooseField = 'type';
  kintone.events.on([`app.record.create.change.${chooseField}`, `app.record.edit.change.${chooseField}`], (event) => {
    const type = event.changes.field.value;
    if (type === '人事合同') {
      kintone.app.record.setFieldShown('companySearch', false);
      kintone.app.record.setFieldShown('companyOpenCode', false);
      kintone.app.record.setFieldShown('companyName', false);
      kintone.app.record.setFieldShown('entPersonOpenCode', false);
      kintone.app.record.setFieldShown('companyUserName', false);
      kintone.app.record.setFieldShown('personSearch', true);
      kintone.app.record.setFieldShown('personOpenCode', true);
      kintone.app.record.setFieldShown('username', true);
    }
    if (type === '对外合同') {
      kintone.app.record.setFieldShown('companySearch', true);
      kintone.app.record.setFieldShown('companyOpenCode', true);
      kintone.app.record.setFieldShown('companyName', true);
      kintone.app.record.setFieldShown('entPersonOpenCode', true);
      kintone.app.record.setFieldShown('companyUserName', true);
      kintone.app.record.setFieldShown('personSearch', false);
      kintone.app.record.setFieldShown('personOpenCode', false);
      kintone.app.record.setFieldShown('username', false);
    }
    return event;
  });

})(kintone.$PLUGIN_ID);