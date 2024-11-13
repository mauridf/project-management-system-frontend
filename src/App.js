import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { CssBaseline, Drawer, AppBar, Toolbar, Typography, List, ListItem, ListItemText, Divider, IconButton } from '@mui/material';
import { styled } from '@mui/system';
import { Home, Work, Assignment } from '@mui/icons-material'; // Ícones do Material UI
import ProjectPage from './pages/ProjectPage';
import ProjectForm from './pages/ProjectForm';
import TaskPage from './pages/TaskPage';
import TaskForm from './pages/TaskForm';
import HomePage from './pages/HomePage';

// Estilizando componentes
const drawerWidth = 240;

const Root = styled('div')({
  display: 'flex',
});

const StyledDrawer = styled(Drawer)(({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: '#3f51b5', // Cor de fundo do menu
    color: 'white', // Cor do texto
  },
}));

const AppBarOffset = styled(AppBar)({
  width: `calc(100% - ${drawerWidth}px)`,
  marginLeft: drawerWidth,
  backgroundColor: '#3f51b5', // Cor do AppBar
});

const Content = styled('main')(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  marginLeft: drawerWidth,
}));

const MenuListItem = ({ to, icon, text }) => (
  <ListItem button component={Link} to={to}>
    <IconButton sx={{ color: 'white' }}>
      {icon}
    </IconButton>
    <ListItemText primary={text} sx={{ color: 'white' }} />
  </ListItem>
);

function App() {
  return (
    <Router>
      <Root>
        <CssBaseline />
        <AppBarOffset position="fixed">
          <Toolbar>
            <Typography variant="h6" noWrap>
              Gerenciamento de Projetos e Tarefas
            </Typography>
          </Toolbar>
        </AppBarOffset>
        <StyledDrawer variant="permanent" anchor="left">
          <List>
            <MenuListItem to="/" icon={<Home />} text="Início" />
            <MenuListItem to="/projetos" icon={<Work />} text="Projetos" />
            <MenuListItem to="/tarefas" icon={<Assignment />} text="Tarefas" />
          </List>
          <Divider />
        </StyledDrawer>
        <Content>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projetos" element={<ProjectPage />} />
            <Route path="/projetos/cadastrar" element={<ProjectForm />} />
            <Route path="/tarefas" element={<TaskPage />} />
            <Route path="/tarefas/cadastrar" element={<TaskForm />} />
          </Routes>
        </Content>
      </Root>
    </Router>
  );
}

export default App;
