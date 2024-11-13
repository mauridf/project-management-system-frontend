import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box, CircularProgress, Grid } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import ProjectForm from '../pages/ProjectForm'; // O formulário de projeto

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projetos');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao carregar projetos', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [projects]);

  const handleNewProjectClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/projetos/${id}`);
      setProjects(projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Erro ao excluir projeto', error);
    }
  };

  const handleEditProject = (id) => {
    // Você pode adicionar lógica para editar um projeto aqui.
    console.log('Editar projeto', id);
  };

  // Função para formatar a data no formato brasileiro (dd/mm/yyyy)
  const formatarData = (data) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(data).toLocaleDateString('pt-BR', options);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ marginTop: '20px' }}>
        Projetos Cadastrados
      </Typography>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleNewProjectClick} sx={{ marginBottom: '20px' }}>
        Novo Projeto
      </Button>

      {showForm && <ProjectForm onClose={handleCloseForm} />}

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Grid container justifyContent="center" sx={{ width: '100%' }}>
          <Grid item xs={12} md={10} lg={8}>
            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell>Prazo</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>{project.nome}</TableCell>
                        <TableCell>{project.descricao}</TableCell>
                        <TableCell>{formatarData(project.prazo)}</TableCell>
                        <TableCell>
                          <Button onClick={() => handleEditProject(project.id)} startIcon={<Edit />} color="primary">
                            Editar
                          </Button>
                          <Button onClick={() => handleDeleteProject(project.id)} startIcon={<Delete />} color="secondary">
                            Deletar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">Nenhum projeto cadastrado.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default ProjectPage;
