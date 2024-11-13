import React, { useState, useEffect } from 'react';
import { Button, TextField, Grid, Box, MenuItem, FormControl, InputLabel, Select } from '@mui/material';
import axios from 'axios';

const TaskForm = ({ task, onClose }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [status, setStatus] = useState('');
  const [dataEntrega, setDataEntrega] = useState('');
  const [projetoId, setProjetoId] = useState('');
  const [projects, setProjects] = useState([]); // Para armazenar os projetos disponíveis

  useEffect(() => {
    if (task) {
      setTitulo(task.titulo);
      setDescricao(task.descricao);
      setStatus(task.status);
      setDataEntrega(task.dataEntrega);
      setProjetoId(task.projetoId);
    }

    // Buscar os projetos cadastrados
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/projetos');
        setProjects(response.data);
      } catch (error) {
        console.error('Erro ao carregar projetos', error);
      }
    };

    fetchProjects();
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      titulo,
      descricao,
      status,
      dataEntrega,
      projetoId,
    };

    try {
      if (task) {
        // Atualiza a tarefa existente
        await axios.put(`http://localhost:3000/api/tarefas/${task.id}`, taskData);
      } else {
        // Cria uma nova tarefa
        await axios.post('http://localhost:3000/api/tarefas', taskData);
      }

      onClose(); // Fecha o formulário após salvar
    } catch (error) {
      console.error('Erro ao salvar tarefa', error);
    }
  };

  return (
    <Box sx={{ width: '100%', padding: '20px' }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Título"
              fullWidth
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              fullWidth
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Em Progresso">Em Progresso</MenuItem>
                <MenuItem value="Finalizado">Finalizado</MenuItem>
                <MenuItem value="Em Espera">Em Espera</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Data de Entrega"
              fullWidth
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Projeto</InputLabel>
              <Select
                label="Projeto"
                value={projetoId}
                onChange={(e) => setProjetoId(e.target.value)}
              >
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.nome}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {task ? 'Atualizar Tarefa' : 'Criar Tarefa'}
            </Button>
          </Grid>
        </Grid>
      </form>
      <Button onClick={onClose} variant="outlined" color="secondary" sx={{ marginTop: '10px' }}>
        Cancelar
      </Button>
    </Box>
  );
};

export default TaskForm;
