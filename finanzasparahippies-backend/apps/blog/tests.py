from django.test import TestCase
from django.contrib.auth import get_user_model
from apps.blog.models import Post, Category, Tag

User = get_user_model()

class BlogModelTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="author@finanzasparahippies.com",
            password="SecurePassword123!",
            username="author_fph"
        )
        self.category = Category.objects.create(name="Educación Financiera")
        self.tag = Tag.objects.create(name="Minimalismo")

    def test_post_creation_and_slugify(self):
        """Verifica la creación de un Post y la autogeneración del slug."""
        post = Post.objects.create(
            author=self.user,
            title="Cómo Ahorrar sin Perder el Alma",
            content="Contenido detallado sobre finanzas conscientes.",
            status="published"
        )
        post.categories.add(self.category)
        post.tags.add(self.tag)

        self.assertEqual(post.slug, "como-ahorrar-sin-perder-el-alma")
        self.assertEqual(post.status, "published")
        self.assertEqual(post.categories.count(), 1)
        self.assertEqual(post.tags.count(), 1)

    def test_draft_post_isolation(self):
        """Valida que los borradores no aparezcan en listas públicas filtradas."""
        Post.objects.create(
            author=self.user,
            title="Borrador Secreto",
            content="Texto en borrador",
            status="draft"
        )
        published_posts = Post.objects.filter(status="published")
        self.assertEqual(published_posts.count(), 0)
