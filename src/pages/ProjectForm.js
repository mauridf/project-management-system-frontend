// src/components/ProjectForm.js
import React, { useState } from 'react';
import { TextField, Button, Box, Grid, Paper, Typography } from '@mui/material';
import axios from 'axios';

const ProjectForm = ({ onClose }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [prazo, setPrazo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/api/projetos', { nome, descricao, prazo });
      alert('Projeto criado com sucesso!');
      onClose(); // Fecha o formulário
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  };

  return (
    <Box
      component={Paper}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        maxWidth: 400,
        margin: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom>
        Criar Novo Projeto
      </Typography>
      <form onSubmit={handleSubmit} style={{ width: '100%' }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Nome do Projeto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Prazo"
              type="date"
              value={prazo}
              onChange={(e) => setPrazo(e.target.value)}
              InputLabelProps={{ shrink: true }}
              required
              />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Criar Projeto
            </Button>
          </Grid>
        </Grid>
      </form>
      <Button onClick={onClose} variant="text" color="secondary" fullWidth sx={{ marginTop: 2 }}>
        Fechar
      </Button>
    </Box>
  );
};

export default ProjectForm;
