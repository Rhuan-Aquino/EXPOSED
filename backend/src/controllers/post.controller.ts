import { prisma } from "../prisma.client";
import { supabase } from "../lib/superbase";

export async function createPost(req: any, res: any) {
  try {
    const userId = req.user.userId;
    const content = req.body?.content;

    if (content == null || String(content).trim() === "") {
      return res.status(400).json({
        error: "Campo content é obrigatório",
      });
    }

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    let imageUrl = null;

    if (req.file) {
      const file = req.file;
      const fileName = `${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from("posts")
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      const { data } = supabase.storage
        .from("posts")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const post = await prisma.post.create({
      data: {
        content,
        imageUrl,
        userId,
      },
    });

    res.status(201).json(post);
  } catch (error) {
    console.log(req.file),
    console.error(error);
    res.status(500).json({ error: "Erro ao criar post" });
  }
}


export async function getPosts(req: any, res: any) {
    try {
      const posts = await prisma.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
  
      res.json(posts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar posts" });
    }
}

export async function deletePost(req: any, res: any) {
    try {
      const userId = req.user.userId;
      const { postId } = req.params;
  
      // 🔍 Busca o post
      const post = await prisma.post.findUnique({
        where: { id: postId },
      });
  
      if (!post) {
        return res.status(404).json({ error: "Post não encontrado" });
      }
  
      // 🔐 Verifica dono
      if (post.userId !== userId) {
        return res.status(403).json({ error: "Sem permissão" });
      }
  
      // 🗑️ Remove imagem do Supabase (se existir)
      if (post.imageUrl) {
        const fileName = post.imageUrl.split("/posts/")[1];
  
        await supabase.storage
          .from("posts")
          .remove([fileName]);
      }
  
      // 🗑️ Remove do banco
      await prisma.post.delete({
        where: { id: postId },
      });
  
      res.json({ message: "Post deletado com sucesso" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar post" });
    }
  }