const DrawerMenuJulia = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen
        name="Cadastro Fornecedores"
        component={CadastroFornecedores}
      />
      <Drawer.Screen name="Cadastro Cotações" component={CadastroCotacoes} />
      <Drawer.Screen name="Nova Requisição" component={NovaRequisicaoCompra} />
      <Drawer.Screen name="Configurações" component={ConfiguracaoPerfil} />
      <Drawer.Screen name="Logout" component={LogoutScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerMenuJulia;
