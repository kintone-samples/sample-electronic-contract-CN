import { Label, Text, Button } from '@kintone/kintone-ui-component/esm/js';

((PLUGIN_ID) => {
  const apiUrl = "https://cybozudev.haoricheng.cn";
  let headerInfo = kintone.plugin.app.getProxyConfig(apiUrl, 'POST');
  let serverToken = '';
  if (headerInfo) {
    const { groups: { token } } = /Bearer (?<token>[^ $]*)/.exec(headerInfo.headers['Authorization']);
    serverToken = token;
  }

  const tokenDiv = document.getElementById('token');
  const tokenText = new Text({
    placeholder: 'token',
    value: serverToken
  });
  tokenDiv.appendChild(new Label({ text: 'Token', isRequired: true }).render());
  tokenDiv.appendChild(tokenText.render());

  const saveButton = new Button({ text: 'Save', type: 'submit' });
  document.getElementById('save_button').appendChild(saveButton.render());
  saveButton.on('click', async () => {
    const token = tokenText.getValue();
    const pluginHeader = {
      'Authorization': `Bearer ${token}`
    };
    kintone.plugin.app.setProxyConfig(apiUrl, 'GET', pluginHeader, {}, () => {
      kintone.plugin.app.setProxyConfig(apiUrl, 'POST', pluginHeader, {});
    });
  });
})(kintone.$PLUGIN_ID);
